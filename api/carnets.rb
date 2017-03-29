# coding: utf-8
# API pour l'interface des carnets
require 'pdfkit'

# Api sur les carnets de suivi
class CarnetsApi < Grape::API
  format :json
  content_type :json, 'application/json'
  content_type :pdf, 'application/pdf'

  include CarnetsLib

  helpers Laclasse::Helpers::User
  helpers URLHelpers

  desc 'récupère un carnet'
  params do
    optional :id, type: Integer
    optional :uid_elv, type: String
  end
  get do
    carnet = if params.key?( :id )
               Carnet[ id: params[:id] ]
             elsif params.key?( :uid_elv )
               Carnet[ uid_elv: params[:uid_elv] ]
             end
    error!( 'Unknown Carnet', 404 ) if carnet.nil?

    droit = carnet.droits_dataset[uid: user[:uid]]
    error!( 'Unauthorized', 401 ) if droit.nil? || !droit.read

    carnet
  end

  desc 'liste les carnets auxquels un utilisateur a accès'
  params do
    requires :uid, type: String
  end
  get '/visible/:uid' do
    error!( '401', 401 ) if params[:uid] != user[:uid]

    Carnet.where( id: Droit.where( uid: params[:uid] ).select( :carnet_id ).all.map(&:carnet_id) )
          .naked
          .all
  end

  desc 'récupère les carnets de la classes'
  params do
    requires :classe_id, type: Integer
  end
  get '/classes/:classe_id' do
    response = Laclasse::CrossApp::Sender.send_request_signed(:service_annuaire_regroupement, params[:classe_id].to_s, 'expand' => 'true')
    # TODO: handle error

    CarnetsLib.search_carnets_of( response['eleves'] )
  end

  desc "recherche des élèves d'un utilisateur par nom"
  params do
    requires :name, type: String, desc: "nom de l'élève"
  end
  get '/eleves/:name' do
    response = Laclasse::CrossApp::Sender.send_request_signed(:service_annuaire_suivi_perso, 'users/' + user[:info].uid.to_s + '/eleves/' + URI.encode( params[:name] ), {})
    # TODO: handle error

    CarnetsLib.search_carnets_of( response )
  end

  desc "création d'un carnet"
  params do
    requires :uid_elv, type: String

    requires :with_model, type: Boolean
  end
  post do
    carnet = Carnet[ uid_elv: params[:uid_elv] ]
    error!( 'Existing Carnet', 403 ) unless carnet.nil?

    # FIXME: anyone can create a carnet?
    carnet = Carnet.create( uid_elv: params[:uid_elv] )

    last_carnet_bdd = Carnet.where(uid_adm: params[:uid_adm]).order(:date_creation).last if params[:with_model] == true
    unless last_carnet_bdd.nil?
      last_carnet = CarnetObject.new(last_carnet_bdd.id)
      last_carnet.read
    end
    carnet.create

    CarnetsLib.last_carnet_model last_carnet, carnet if !last_carnet.nil? && last_carnet.id != carnet.id

    right_adm = Right.new(nil, params[:uid_adm], params[:full_name_adm], params[:profil_adm], carnet.id, 1, 1, 1)
    right_adm.create
    right_elv = Right.new(nil, params[:uid_elv], params[:full_name_elv], 'élève', carnet.id, 0, 0, 0)
    right_elv.create

    { carnet_id: carnet.id }
  end

  desc "création d'un pdf du carnet"
  params do
    requires :nom, type: String
    requires :prenom, type: String
    requires :classe, type: String
    requires :college, type: String
    requires :avatar, type: String
    requires :sexe, type: String
    requires :id_onglets, type: Array
  end
  post '/:uid_elv/pdf' do
    ids = params[:id_onglets].map( &:id )

    onglets = CarnetsLib.tab_list( params[:uid_elv], ids )
    final_document = PdfGenerator.generate_pdf( params[:nom],
                                                params[:prenom],
                                                params[:sexe],
                                                params[:classe],
                                                params[:avatar],
                                                params[:college],
                                                onglets )

    # generate pdf
    kit = PDFKit.new( final_document, page_size: 'A4' )

    kit.stylesheets << 'public/app/css/pdf/pdf.css'

    content_type 'application/pdf'
    kit.to_pdf
  end

  desc 'envoi un email a chaque destinataire'
  params do
    requires :mail_infos, type: Object
    optional :file, type: Object
  end
  post '/email' do
    file = {name: params[:file][:filename], path: params[:file][:tempfile].path} unless params[:file].nil?
    infos = JSON.parse(params[:mail_infos])
    MailGenerator.send_emails infos['uid_exp'], infos['destinataires']['list'], infos['objet'], infos['message'], file
  end

  # vv EVIGNAL vv

  desc 'récupère les carnets d\'Élie Vignal'
  get '/evignal' do
    Carnet.where(evignal: true).naked.all
  end

  desc 'récupère le personnel à l\'hopital d\'Evignal'
  params do
    requires :uid_elv, type: String
    requires :hopital, type: Boolean
  end
  get '/evignal/personnels' do  # '/evignal/:uid_elv/personnels'
    # retourne les droits +evignal du carnet
    carnet = Carnet[ uid_elv: params[:uid_elv] ]
    error!( 'Unknown Carnet', 404 ) if carnet.nil?

    { personnels: carnet.droits_dataset.where( evignal: true, hopital: params[:hopital] ).naked.all }
  end

  desc "recherche des élèves dans tous les etabs d'un utilisateur par nom"
  params do
    requires :name, type: String, desc: "nom de l'élève"
  end
  get '/evignal/eleves/:name' do
    profil_actif_current_user = user[:user_detailed]['profil_actif']['etablissement_code_uai']

    error!('Ressource non trouvee', 404) if profil_actif_current_user != UAI_EVIGNAL

    response = Laclasse::CrossApp::Sender.send_request_signed(:service_annuaire_suivi_perso, ANNUAIRE_URL[:suivi_perso_search] + URI.encode( params[:name] ), {})

    CarnetsLib.search_carnets_of( response, true )
  end

  desc "création ou mise a jour d'un carnet evignal"
  params do
    requires :uid_elv, type: String
    requires :full_name_elv, type: String
    requires :etablissement_code, type: String
    requires :classe_id, type: Integer
    requires :uid_adm, type: String
    requires :full_name_adm, type: String
    requires :profil_adm, type: String
    requires :with_model, type: Boolean
  end
  post '/evignal' do
    carnet = CarnetObject.new(nil, params[:uid_elv], params[:uid_adm], params[:etablissement_code], params[:classe_id], nil, true)
    if carnet.exist?
      carnet.read
      carnet.update true
    else
      last_carnet_bdd = CarnetObject.odel.where(uid_adm: params[:uid_adm]).order(:date_creation).last if params[:with_model] == true
      unless last_carnet_bdd.nil?
        last_carnet = CarnetObject.new(last_carnet_bdd.id)
        last_carnet.read
      end
      evignal = params[:etablissement_code] == UAI_EVIGNAL ? 1 : 0
      carnet.create
      CarnetsLib.last_carnet_model last_carnet, carnet if !last_carnet.nil? && last_carnet.id != carnet.id
      right_adm = Right.new(nil, params[:uid_adm], params[:full_name_adm], params[:profil_adm], carnet.id, 1, 1, 1, 0, 1)
      right_adm.create
      right_elv = Right.new(nil, params[:uid_elv], params[:full_name_elv], 'élève', carnet.id, 0, 0, 0, 0, evignal)
      right_elv.create
    end

    { carnet_id: carnet.id }
  end
end
