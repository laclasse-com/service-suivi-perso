# coding: utf-8
# API pour l'interface des carnets
require 'pdfkit'

# Api sur les carnets de suivi
class CarnetsApi < Grape::API
  format :json
  content_type :json, 'application/json'
  content_type :pdf, 'application/pdf'

  helpers Laclasse::Helpers::User
  helpers URLHelpers
  helpers do
    params :creation_carnet_params_set do
      requires :uid_elv, type: String
      requires :full_name_elv, type: String
      requires :etablissement_code, type: String
      requires :classe_id, type: Integer
      requires :uid_adm, type: String
      requires :full_name_adm, type: String
      requires :profil_adm, type: String
      requires :with_model, type: Boolean
    end
  end
  include CarnetsLib

  desc 'récupère un carnet'
  params do
    optional :id, type: Integer
    optional :uid_elv, type: String
  end
  get '/' do
    begin
      carnet = Carnet.new(params[:id], params[:uid_elv])
      carnet.read

      { id: carnet.id,
        uid_elv: carnet.uid_elv,
        uid_adm: carnet.uid_adm,
        uai: carnet.uai,
        id_classe: carnet.id_classe,
        url_pub: carnet.url_pub,
        date_creation: carnet.date_creation }
    rescue Exception
      {error: 'Impossible de récupérer le carnet'}
    end
  end

  desc 'récupère les carnets de la classes'
  params do
    requires :classe_id, type: Integer
  end
  get '/classes/:classe_id' do
    begin
      response = Laclasse::CrossApp::Sender.send_request_signed(:service_annuaire_regroupement, params[:classe_id].to_s, 'expand' => 'true')
      CarnetsLib.carnets_de_la_classe response
    rescue Exception
      {error: 'Impossible de récupérer les carnets'}
    end
  end

  desc 'récupère les carnets d\'e Vignal'
  get '/evignal' do
    begin
      CarnetsLib.carnets_evignal
    rescue Exception => e
      puts e.message
      puts e.backtrace[0..10]
      [{error: 'Impossible de récupérer les carnets'}]
    end
  end

  desc 'récupère le personnel à l\'hopital d\'Evignal'
  params do
    requires :uid_elv, type: String
    requires :hopital, type: Boolean
  end
  get '/evignal/personnels' do
    personnels = []
    begin
      carnet = Carnet.new(nil, params[:uid_elv])
      carnet.read
      pers = carnet.get_pers_evignal_or_hopital true, params[:hopital]
      pers.each do |p|
        personnels.push(id_ent: p.uid, profil: p.profil, fullname: p.full_name)
      end
      {personnels: personnels}
    rescue Exception
      {error: "Impossible de récupérer le personnel à l'hôpital"}
    end
  end

  desc "recherche des élèves d'un utilisateur par nom"
  params do
    requires :name, type: String, desc: "nom de l'élève"
  end
  get '/eleves/:name' do
    response = Laclasse::CrossApp::Sender.send_request_signed(:service_annuaire_suivi_perso, 'users/' + user[:info].uid.to_s + '/eleves/' + params[:name], {})
    CarnetsLib.search_carnets_of response
  end

  desc "recherche des élèves dans tous les etabs d'un utilisateur par nom"
  params do
    requires :name, type: String, desc: "nom de l'élève"
  end
  get '/evignal/eleves/:name' do
    profil_actif_current_user = user[:user_detailed]['profil_actif']['etablissement_code_uai']
    if profil_actif_current_user != UAI_EVIGNAL
      error!('Ressource non trouvee', 404)
    end
    response = Laclasse::CrossApp::Sender.send_request_signed(:service_annuaire_suivi_perso, ANNUAIRE_URL[:suivi_perso_search] + params[:name], {})
    CarnetsLib.search_carnets_of response, true
  end

  desc "création d'un carnet"
  params do
    use :creation_carnet_params_set
  end
  post '/'do
    carnet = Carnet.new(nil, params[:uid_elv], params[:uid_adm], params[:etablissement_code], params[:classe_id])
    begin
      last_carnet_bdd = Carnets.where(uid_adm: params[:uid_adm]).order(:date_creation).last if params[:with_model] == true
      unless last_carnet_bdd.nil?
        last_carnet = Carnet.new(last_carnet_bdd.id)
        last_carnet.read
      end
      carnet.create
      CarnetsLib.last_carnet_model last_carnet, carnet if !last_carnet.nil? && last_carnet.id != carnet.id
      right_adm = Right.new(nil, params[:uid_adm], params[:full_name_adm], params[:profil_adm], carnet.id, 1, 1, 1)
      right_adm.create
      right_elv = Right.new(nil, params[:uid_elv], params[:full_name_elv], 'élève', carnet.id, 0, 0, 0)
      right_elv.create
      {carnet_id: carnet.id}
    rescue
      {error: 'erreur lors de la création du carnet'}
    end
  end

  desc "création ou mise a jour d'un carnet evignal"
  params do
    use :creation_carnet_params_set
  end
  post '/evignal'do
    carnet = Carnet.new(nil, params[:uid_elv], params[:uid_adm], params[:etablissement_code], params[:classe_id], nil, true)
    begin
      if carnet.exist?
        carnet.read
        carnet.update true
      else
        last_carnet_bdd = Carnets.where(uid_adm: params[:uid_adm]).order(:date_creation).last if params[:with_model] == true
        unless last_carnet_bdd.nil?
          last_carnet = Carnet.new(last_carnet_bdd.id)
          last_carnet.read
        end
        params[:etablissement_code] == UAI_EVIGNAL ? evignal = 1 : evignal = 0
        carnet.create
        CarnetsLib.last_carnet_model last_carnet, carnet if !last_carnet.nil? && last_carnet.id != carnet.id
        right_adm = Right.new(nil, params[:uid_adm], params[:full_name_adm], params[:profil_adm], carnet.id, 1, 1, 1, 0, 1)
        right_adm.create
        right_elv = Right.new(nil, params[:uid_elv], params[:full_name_elv], 'élève', carnet.id, 0, 0, 0, 0, evignal)
        right_elv.create
      end
      {carnet_id: carnet.id}
    rescue
      {error: 'erreur lors de la création du carnet'}
    end
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
    begin
      ids = []
      params[:id_onglets].each do |onglet|
        ids.push onglet.id
      end

      onglets = CarnetsLib.tab_list params[:uid_elv], ids
      final_document = PdfGenerator.generate_pdf params[:nom], params[:prenom], params[:sexe], params[:classe], params[:avatar], params[:college], onglets

      # generate pdf
      kit = PDFKit.new(final_document, page_size: 'Letter')

      kit.stylesheets << 'public/app/styles/pdf/pdf.css'
      content_type 'application/pdf'
      kit.to_pdf

    rescue Exception => e
      p e.message.inspect
      p e.backtrace[0..10].inspect
      error!('Ressource non trouvee', 404)
    end
  end

  desc 'envoi un email a chaque destinataire'
  params do
    requires :mail_infos, type: Object
    optional :file, type: Object
  end
  post '/email' do
    begin
      file = {name: params[:file][:filename], path: params[:file][:tempfile].path} unless params[:file].nil?
      infos = JSON.parse(params[:mail_infos])
      MailGenerator.send_emails infos['uid_exp'], infos['destinataires']['list'], infos['objet'], infos['message'], file
    rescue Exception => e
      p e.message.inspect
      p e.backtrace[0..10].inspect
      error!('Ressource non trouvee', 404)
    end
  end
end
