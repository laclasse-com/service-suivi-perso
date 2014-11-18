#coding: utf-8
# API pour l'interface des carnets
require 'pdfkit'
class CarnetsApi < Grape::API
	format :json
    content_type :json, "application/json"
    content_type :pdf, 'application/pdf'
	helpers AuthenticationHelpers
    include CarnetsLib

    desc 'récupère un carnet'
    params{
        optional :id, type: Integer
        optional :uid_elv, type: String
    }
    get '/' do
        begin
            carnet = Carnet.new(params[:id], params[:uid_elv])
            carnet.read
            {id: carnet.id, uid_elv: carnet.uid_elv, uid_adm: carnet.uid_adm, uai: carnet.uai, id_classe: carnet.id_classe, url_pub: carnet.url_pub, date_creation: carnet.date_creation}
        rescue Exception => e
            {error: "Impossible de récupérer le carnet"}
        end
    end

    desc 'récupère les carnets de la classes'
    params{
        requires :classe_id, type: Integer
    }
    get '/classes/:classe_id' do
        response = Annuaire.send_request_signed(ANNUAIRE[:url], ANNUAIRE[:service_annuaire_regroupements] + params[:classe_id].to_s, {'expand' => 'true'})
        CarnetsLib.get_carnets_by_classe_of response
    end

    desc "recherche des élèves d'un utilisateur par nom"
    params {
        requires :name, type: String, desc: "nom de l'élève"
    }
    get '/eleves/:name' do
        response = Annuaire.send_request_signed(ANNUAIRE[:url], ANNUAIRE[:service_annuaire_user] + $current_user[:info].uid.to_s + '/eleves', {'nom' => params[:name], 'expand' => 'true'})
        CarnetsLib.search_carnets_of response
    end

    desc "création d'un carnet"
    params{
        requires :uid_elv, type: String
        requires :full_name_elv, type: String
        requires :etablissement_code, type: String
        requires :classe_id, type: Integer
        requires :uid_adm, type: String
        requires :full_name_adm, type: String
        requires :profil_adm, type: String
    }
    post '/'do
        carnet = Carnet.new(nil, params[:uid_elv], params[:uid_adm], params[:etablissement_code], params[:classe_id])
        begin
            carnet.create
            right_adm = Right.new(nil, params[:uid_adm], params[:full_name_adm], params[:profil_adm], carnet.id, 1, 1, 1)
            right_adm.create
            right_elv = Right.new(nil, params[:uid_elv], params[:full_name_elv], "élève", carnet.id, 0, 0, 0)
            right_elv.create
            {carnet_id: carnet.id}            
        rescue
            {error: "erreur lors de la création du carnet"}
        end
    end

    desc "création d'un pdf du carnet"
    params{
        requires :mail_infos, type: String
        requires :nom, type: String
        requires :prenom, type: String
        requires :classe, type: String
        requires :college, type: String
        requires :sexe, type: String
        requires :id_onglets, type: Array
    }
    post '/:uid_elv/pdf' do
        begin
            ids = []
            params[:id_onglets].each do |onglet|
                ids.push onglet.id
            end
            # p params[:uid_elv].inspect
            onglets = CarnetsLib.get_tabs params[:uid_elv], ids
            # puts onglets.inspect
            final_document = ""
            final_document = PdfGenerator::generate_pdf params[:nom], params[:prenom], params[:sexe], params[:classe], params[:college], onglets
            # generate pdf
            kit = PDFKit.new(final_document, :page_size => 'Letter')
            # puts kit.inspect
            kit.stylesheets << 'public/app/styles/pdf/pdf.css'
            content_type 'application/pdf'
            kit.to_pdf
            
        rescue Exception => e
            p e.message.inspect
            p e.backtrace[0..10].inspect
            error!('Ressource non trouvee', 404)
        end
    end

    desc "envoi un email a chaque destinataire"
    params{
        requires :mail_infos, type: Object
        optional :file, type: Object
    }
    post '/email' do
        begin
            file = {:name => params[:file][:filename], :path => params[:file][:tempfile].path} if !params[:file].nil?
            infos = JSON.parse(params[:mail_infos])
            MailGenerator.send_emails infos["uid_exp"], infos["destinataires"]["list"], infos["objet"], infos["message"], file
        rescue Exception => e
            p e.message.inspect
            p e.backtrace[0..10].inspect
            error!('Ressource non trouvee', 404) 
        end
    end
    # before do
    #     CarnetsLib.set_current_user get_current_user
    # end

    # desc "retourne tous les carnets d'un utilisateur E.Vignal"
    # params {
    #     requires :uid, type: String, desc: "uid d'un utilisateur"
    # }
    # get '/evignal/:uid' do
    #     carnets = Annuaire.get_list_carnets_of(params[:uid])
    # end

    # desc "retourne tous les carnets d'un regroupement d'un utilisateur "
    # params {
    #   requires :uid, type: String, desc: "uid d'un utilisateur"
    #   requires :id_rgrp, type: String, desc: "id d'un regroupement"
    # }
    # get '/regroupements/:uid/:id_rgrp' do
    #   uids = Annuaire.get_carnets_regroupement_of(params[:uid], params[:id_rgrp])
    # end

    # desc "Créé un carnet dans la base de donnée"
    # params {
    #   # requires :uid, type: String, desc: "uid d'un utilisateur"
    #   # requires :id_rgrp, type: String, desc: "id d'un regroupement"
    # }
    # get '/add/:uid' do #/:id_rgrp' do
    #   uids = CarnetsLib.create(params[:uid])
    # end
end