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

  desc 'récupère un carnet avec création à la volée'
  params do
    requires :uid_elv, type: String

    optional :with_model, type: Boolean, default: false
    optional :evignal, type: Boolean, default: false
  end
  get do
    #error!( 'Unknown Carnet', 404 ) if invalid_uid_elv
    carnet = Carnet[ uid_elv: params[:uid_elv] ]

    if carnet.nil?
      carnet = Carnet.create( uid_elv: params[:uid_elv],
                              evignal: params[:evignal] )

      if params[:evignal]
      end

      if params[:with_model]
      end
    end

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
    onglets = CarnetsLib.tab_list( params[:uid_elv], params[:id_onglets].map( &:id ) )
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
end
