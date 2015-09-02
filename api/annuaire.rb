# coding: utf-8

require 'logger'

# API d'interfaçage avec l'annuaire
class AnnuaireApi < Grape::API
  format :json

  helpers AuthenticationHelpers
  helpers RolesHelpers

  desc "retourne le profile actif de l'utilisateur courant"
  get '/currentuser' do
    response = env['rack.session'][:current_user][:user_detailed]
    hight_role = ''
    response['roles'].each do |role|
      if role['etablissement_code_uai'] == response['profil_actif']['etablissement_code_uai'] && COEFF[hight_role] < COEFF[role['role_id']]
        hight_role = role['role_id']
      end
    end
    if response['error'].nil?
      {
        id_ent: response['id_ent'],
        profil_actif: response['profil_actif'],
        actif: response['profil_actif']['actif'],
        role_max_priority: response['roles_max_priority_etab_actif'],
        etablissement_id: response['profil_actif']['etablissement_id'],
        profil_id: response['profil_actif']['profil_id'],
        roles: response['roles'],
        profils: response['profils'],
        hight_role: hight_role,
        user_id: response['profil_actif']['user_id'],
        sexe: response['sexe'],
        nom: response['nom'],
        prenom: response['prenom'],
        classes: response['classes'],
        enfants: response['enfants'],
        avatar: response['avatar']
      }
    else
      response['error']
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
    response = env['rack.session'][:current_user][:user_detailed]
    if response['error'].nil?
      classes = response['classes'].sort_by { |classe| [classe['etablissement_nom'], classe['classe_libelle']] }
      classes = classes.uniq { |classe| [classe['classe_id'], classe['etablissement_code']] }
      classes.reverse
    else
      response['error']
    end
  end

  desc 'récupère les informations sur un regroupement'
  params do
    requires :rgp_id, type: Integer
  end
  get '/regroupements/:rgp_id' do
    response = Laclasse::CrossApp::Sender.send_request_signed(:service_annuaire_regroupement, params[:rgp_id].to_s, 'expand' => 'true')
    response
  end

  desc 'récupère les utilisateur d\'un etablissement'
  params do
    requires :uai, type: String
    requires :uid_elv, type: String
  end
  get '/etablissements/:uai/personnels' do
    all_users = []
    users = []
    personnels = Laclasse::CrossApp::Sender.send_request_signed(:service_annuaire_personnel, params[:uai].to_s + '/personnel', {})

    all_users.concat affecter_role_max(personnels) if personnels.class == Array

    eleve = Laclasse::CrossApp::Sender.send_request_signed(:service_annuaire_user, params[:uid_elv].to_s, 'expand' => 'true')
    eleve['role_id'] = ROLES[:eleve]
    all_users.concat([eleve]) if eleve['error'].nil?
    parents = []
    eleve['parents'].each do |p|
      parent = Laclasse::CrossApp::Sender.send_request_signed(:service_annuaire_user, p['id_ent'].to_s, 'expand' => 'true')
      parent['role_id'] = ROLES[:parents]
      parents.concat([parent]) if parent['error'].nil?
    end
    all_users.concat(parents)
    all_users.each do |user|
      carnet = Carnet.new(nil, params[:uid_elv])
      carnet.read
      right = Right.new(nil, user['id_ent'], nil, nil, carnet.id)
      users.push user unless right.exist?
    end
    users
  end

  desc 'récupère le personnel de evignal'
  params do
    requires :uai, type: String
    requires :uid_elv, type: String
  end
  get '/evignal/:uai/personnels' do
    all_users = []
    users = []
    personnels = Laclasse::CrossApp::Sender.send_request_signed(:service_annuaire_personnel, params[:uai].to_s + '/personnel', {})

    all_users.concat affecter_role_max(personnels) if personnels.class == Array

    all_users.each do |user|
      begin
        carnet = Carnet.new(nil, params[:uid_elv])
        carnet.read
        right = Right.new(nil, user['id_ent'], nil, nil, carnet.id)
        right.select
      rescue Exception
        users.push user
      end
    end
    users
  end

  desc 'récupère les avatars des proprietaire des messages'
  params do
    requires :uids, type: Array
  end
  post '/avatars' do
    begin
      uids = params[:uids]
      users = []
      avatars = {}
      while uids.size > 50
        users.concat(Laclasse::CrossApp::Sender.send_request_signed(:service_annuaire_user, ANNUAIRE_URL[:user_liste] + uids.pop(50).join('_').to_s, {}))
      end
      users.concat(Laclasse::CrossApp::Sender.send_request_signed(:service_annuaire_user, ANNUAIRE_URL[:user_liste] + uids.join('_').to_s, {})) unless uids.empty?
      users.each do |user|
        avatars[user['id_ent']] = user['avatar']
      end
      avatars
    rescue Exception => e
      puts e.message
      puts e.backtrace[0..10]
      { error: 'Impossible de retourner les avatars' }
    end
  end
end
