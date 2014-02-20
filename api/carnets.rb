# API pour l'interface des carnets
class CarnetsApi < Grape::API
	format :json

	helpers AuthenticationHelpers

    desc "retourne tous les carnets d'un utilisateur E.Vignal"
    params {
        requires :uid, type: String, desc: "uid d'un utilisateur"
    }
    get '/evignal/:uid' do
        uids = Annuaire.get_list_carnets_of(params[:uid])
    end

    # desc "retourne tous les carnets d'un regroupement de l'utilisateur courant "
    # params {
    #   requires :uid, type: String, desc: "uid d'un utilisateur"
    #   requires :uai, type: String, desc: "code uai d'un regroupement"
    # }
    # get '/regroupements/:uid/:uai' do
    #   uids = Annuaire.get_list_elv_of(params[:uid])
    # end

end