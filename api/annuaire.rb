#coding: utf-8

require 'annuaire'
require 'logger'

# API d'interfaçage avec l'annuaire
class AnnuaireApi < Grape::API

  format :json

  helpers AuthenticationHelpers

  desc "retourne le profile actif de l'utilisateur courant"
  get '/currentuser' do
    response = Annuaire.send_request_signed(ANNUAIRE[:url], ANNUAIRE[:service_annuaire_user] + $current_user[:info].uid.to_s, {"expand" => "true"})
    if response["error"].nil?
      {
        id_ent: response["id_ent"],
        actif: response["profil_actif"]["actif"],
        etablissement_id: response["profil_actif"]["etablissement_id"],
        profil_id: response["profil_actif"]["profil_id"],
        user_id: response["profil_actif"]["user_id"],
        sexe: response["sexe"],
        nom: response["nom"],
        prenom: response["prenom"],
        classes: response["classes"],
        enfants: response["enfants"],
        avatar: response["avatar"]
      }
    else 
      response["error"]
    end
  end

  desc "retourne les infos sur un utilisateur"
  params do
    requires :id, type: String
  end
  get '/users/:id' do
    response = Annuaire.send_request_signed(ANNUAIRE[:url], ANNUAIRE[:service_annuaire_user] + params[:id], {"expand" => "true"})
    if response["error"].nil?
      response
    else 
      response["error"]
    end
  end

  desc "retourne toutes les classes de l'utilisateur"
  get '/classes' do
    response = Annuaire.send_request_signed(ANNUAIRE[:url], ANNUAIRE[:service_annuaire_user] + $current_user[:info].uid.to_s, {"expand" => "true"})
    if response["error"].nil?
      response["classes"]
    else 
      response["error"]
    end
  end

  desc 'récupère les informations sur un regroupement'
    params{
        requires :rgp_id, type: Integer
    }
    get '/regroupements/:rgp_id' do
        response = Annuaire.send_request_signed(ANNUAIRE[:url], ANNUAIRE[:service_annuaire_regroupements] + params[:rgp_id].to_s, {'expand' => 'true'})
        response
    end

  desc 'récupère les utilisateur d\'un etablissement'
  params{
      requires :uai, type: String
      requires :uid_elv, type: String
  }
  get '/etablissements/:uai/personnels' do
      allUsers = []
      users=[]
      personnels = Annuaire.send_request_signed(ANNUAIRE[:url], ANNUAIRE[:service_annuaire_etablissements] + params[:uai].to_s + '/personnel', {})
      allUsers.concat(personnels) if personnels.class == Array
      eleve = Annuaire.send_request_signed(ANNUAIRE[:url], ANNUAIRE[:service_annuaire_user] + params[:uid_elv].to_s, {"expand" => "true"})
      eleve["profil_id"] = 'ELV'
      allUsers.concat([eleve]) if eleve["error"].nil?
      parents = []
      eleve["parents"].each do |p|
        parent = Annuaire.send_request_signed(ANNUAIRE[:url], ANNUAIRE[:service_annuaire_user] + p["id_ent"].to_s, {"expand" => "true"})
        parent["profil_id"] = 'TUT'
        parents.concat([parent]) if parent["error"].nil?
      end
      allUsers.concat(parents);
      allUsers.each do |user|
        begin
          carnet = Carnet.new(nil, params[:uid_elv])
          carnet.read
          right = Right.new(nil, user["id_ent"], nil, nil, carnet.id)
          right.select
        rescue Exception => e
          users.push user
        end
      end
      users
  end
end
