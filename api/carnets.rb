# API pour l'interface des carnets
class CarnetsApi < Grape::API
	format :json

	helpers AuthenticationHelpers

    before do
        CarnetsLib.set_current_user get_current_user
    end

    desc "retourne tous les carnets d'un utilisateur E.Vignal"
    params {
        requires :uid, type: String, desc: "uid d'un utilisateur"
    }
    get '/evignal/:uid' do
        carnets = Annuaire.get_list_carnets_of(params[:uid])
    end

    desc "retourne tous les carnets d'un regroupement d'un utilisateur "
    params {
      requires :uid, type: String, desc: "uid d'un utilisateur"
      requires :id_rgrp, type: String, desc: "id d'un regroupement"
    }
    get '/regroupements/:uid/:id_rgrp' do
      uids = Annuaire.get_carnets_regroupement_of(params[:uid], params[:id_rgrp])
    end

end