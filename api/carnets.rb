#coding: utf-8
# API pour l'interface des carnets
class CarnetsApi < Grape::API
	format :json

	helpers AuthenticationHelpers
    include CarnetsLib

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
        response = Annuaire.send_request_signed(ANNUAIRE[:url], ANNUAIRE[:service_annuaire_user] + $current_user[:info].uid.to_s + '/eleves', {'nom' => params[:name]})
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
            right_adm = Right.new(nil, params[:uid_adm], params[:full_name_adm], params[:profil_adm], carnet.id, 1, 1)
            right_adm.create
            right_elv = Right.new(nil, params[:uid_elv], params[:full_name_elv], "élève", carnet.id, 0, 0)
            right_elv.create
            {carnet_id: carnet.id}            
        rescue
            {error: "erreur lors de la création du carnet"}
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