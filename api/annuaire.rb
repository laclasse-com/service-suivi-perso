# -*- coding: utf-8 -*-

require_relative '../lib/annuaire'

# API d'interfaçage avec l'annuaire
class AnnuaireApi < Grape::API
  format :json

  helpers AuthenticationHelpers

  desc "retourne la session rack de lutilisateur"
  params {
  }
  get '/user/session' do
    @current_user
  end

  desc "retourne les informations de l'annuaire sur un utilisateur"
  params {
    requires :uid, type: String, desc: "uid de l'utilisateur"
  }
  get '/:uid' do
    Annuaire.get_info_annuaire_of(params[:uid])
  end

end
