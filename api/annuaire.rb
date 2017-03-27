# coding: utf-8

require 'logger'

# API d'interfaçage avec l'annuaire
class AnnuaireApi < Grape::API
  format :json

  helpers URLHelpers
  helpers RolesHelpers
  helpers Laclasse::Helpers::User

  desc "retourne le profil actif de l'utilisateur courant"
  get '/currentuser' do
    hight_role = ''
    unless user[:user_detailed]['roles'].nil?
      user[:user_detailed]['roles'].each do |role|
        if !user[:user_detailed]['profil_actif'].nil? && role['etablissement_code_uai'] == user[:user_detailed]['profil_actif']['etablissement_code_uai'] && COEFF[hight_role] < COEFF[role['role_id']]
          hight_role = role['role_id']
        end
      end
      { id_ent: user[:user_detailed]['id_ent'],
        profil_actif: user[:user_detailed]['profil_actif'],
        actif: user[:user_detailed]['profil_actif']['actif'],
        role_max_priority: user[:user_detailed]['roles_max_priority_etab_actif'],
        etablissement_id: user[:user_detailed]['profil_actif']['etablissement_id'],
        profil_id: user[:user_detailed]['profil_actif']['profil_id'],
        roles: user[:user_detailed]['roles'],
        profils: user[:user_detailed]['profils'],
        hight_role: hight_role,
        user_id: user[:user_detailed]['profil_actif']['user_id'],
        sexe: user[:user_detailed]['sexe'],
        nom: user[:user_detailed]['nom'],
        prenom: user[:user_detailed]['prenom'],
        classes: user[:user_detailed]['classes'],
        enfants: user[:user_detailed]['enfants'],
        avatar: user[:user_detailed]['avatar'] }
    end
  end

  desc 'retourne les infos sur un utilisateur'
  params do
    requires :id, type: String
  end
  get '/users/:id' do
    response = Laclasse::CrossApp::Sender.send_request_signed(:service_annuaire_user, params[:id], 'expand' => 'true')
    if response['error'].nil?
      prefix_annuaire = ANNUAIRE[:url].split('/')
      prefix_annuaire.pop
      response['avatar'] = prefix_annuaire.join('/') + '/' + response['avatar']
      response
    else
      response['error']
    end
  end

  desc "retourne toutes les classes de l'utilisateur"
  get '/classes' do
    user[:user_detailed]['classes']
      .sort_by { |classe| [classe['etablissement_nom'], classe['classe_libelle']] }
      .uniq { |classe| [classe['classe_id'], classe['etablissement_code']] }
      .reverse
  end

  desc 'récupère les informations sur un regroupement'
  params do
    requires :rgp_id, type: Integer
  end
  get '/regroupements/:rgp_id' do
    Laclasse::CrossApp::Sender.send_request_signed(:service_annuaire_regroupement, params[:rgp_id].to_s, 'expand' => 'true')
  end

  desc 'récupère les utilisateur d\'un etablissement'
  params do
    requires :uai, type: String
    requires :uid_elv, type: String
  end
  get '/etablissements/:uai/personnels' do
    all_users = []
    personnels = Laclasse::CrossApp::Sender.send_request_signed(:service_annuaire_personnel, "#{params[:uai]}/personnel", {})

    all_users.concat( affecter_role_max( personnels ) ) if personnels.is_a? Array

    eleve = Laclasse::CrossApp::Sender.send_request_signed(:service_annuaire_user, params[:uid_elv].to_s, 'expand' => 'true')
    if eleve['error'].nil?
      eleve['role_id'] = ROLES[:eleve]
      all_users.concat([eleve])

      eleve['parents'].each do |p|
        parent = Laclasse::CrossApp::Sender.send_request_signed(:service_annuaire_user, (p['id_ent']).to_s, 'expand' => 'true')
        if parent['error'].nil?
          parent['role_id'] = ROLES[:parents]
          all_users.concat([parent])
        end
      end
    end

    all_users.reject do |user|
      carnet = Carnet.new(nil, params[:uid_elv])
      carnet.read
      right = Right.new(nil, user['id_ent'], nil, nil, carnet.id)

      right.exist?
    end
  end

  desc 'récupère le personnel de evignal'
  params do
    requires :uai, type: String
    requires :uid_elv, type: String
  end
  get '/evignal/:uai/personnels' do
    all_users = []
    personnels = Laclasse::CrossApp::Sender.send_request_signed(:service_annuaire_personnel, "#{params[:uai]}/personnel", {} )

    all_users.concat( affecter_role_max( personnels ) ) if personnels.is_a? Array

    all_users.reject do |user|
      carnet = Carnet.new( nil, params[:uid_elv] )
      carnet.read
      right = Right.new(nil, user['id_ent'], nil, nil, carnet.id)

      right.exist?
    end
  end

  desc 'récupère les avatars des proprietaire des messages'
  params do
    requires :uids, type: Array
  end
  post '/avatars' do
    users = []
    avatars = {}

    while params[:uids].size > 50
      users.concat( Laclasse::CrossApp::Sender.send_request_signed(:service_annuaire_user, "#{ANNUAIRE_URL[:user_liste]}#{params[:uids].pop(50).join('_')}", {} ) )
    end

    users.each do |user|
      avatars[ user['id_ent'] ] = user['avatar']
    end

    avatars
  end
end
