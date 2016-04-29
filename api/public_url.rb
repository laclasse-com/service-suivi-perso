# coding: utf-8
# API pour l'interface pour les urls publiques
class PublicUrlApi < Grape::API
  format :json
  content_type :json, 'application/json'

  helpers Laclasse::Helpers::User
  helpers URLHelpers
  include CarnetsLib

  desc 'création d\'une url public d\'un carnet'
  params do
    requires :uid_elv, type: String
    requires :id_onglets, type: Array
  end
  post '/carnets/:uid_elv' do
    carnet = Carnet.new(nil, params[:uid_elv])
    carnet.read

    # verification des droits coté backend
    right = Right.new( nil, user[:info].uid.to_s, nil, nil, carnet.id )
    begin
      right.select
    rescue Exception
      evignal = user[:user_detailed]['profil_actif']['etablissement_code_uai'] == UAI_EVIGNAL ? 1 : 0

      if ( user[:user_detailed]['profil_actif']['etablissement_code_uai'] == carnet.uai || evignal == 1 ) &&
         user[:user_detailed]['roles_max_priority_etab_actif'] > 1
        right = Right.new nil, params[:uid], user[:user_detailed]['prenom'] + ' ' + user[:user_detailed]['nom'], 'admin', carnet.id, 1, 1, 1, 0, evignal
      end
    end
    if right.admin == 1
      message = "#{carnet.uid_elv}_#{carnet.uid_adm}_#{carnet.uai}_#{carnet.date_creation}_#{Time.now}"

      url_pub = Outils.md5_encode message
      carnet.update( nil, url_pub )
      params[:id_onglets].each do |o|
        onglet = Onglet.new( o['id'] )
        onglet.read
        onglet.update( nil, nil, url_pub )
      end
      prefix_url = URL_ENT.split('').last == '/' ? URL_ENT.chomp('/') : URL_ENT
      { url_pub: prefix_url + APP_PATH + '/public/' + url_pub }
    else
      error!("Vous n'êtes pas autorisé pour cette ressource", 401)
    end
  end

  desc 'suppression d\'une url public d\'un carnet'
  params do
    requires :uid_elv, type: String
  end
  delete '/carnets/:uid_elv' do
    carnet = Carnet.new(nil, params[:uid_elv])
    carnet.read

    # verification des droits coté backend
    right = Right.new nil, user[:info].uid.to_s, nil, nil, carnet.id
    begin
      right.select
    rescue Exception
      evignal = user[:user_detailed]['profil_actif']['etablissement_code_uai'] == UAI_EVIGNAL ? 1 : 0
      if (user[:user_detailed]['profil_actif']['etablissement_code_uai'] == carnet.uai || evignal == 1) && user[:user_detailed]['roles_max_priority_etab_actif'] > 1
        right = Right.new nil, params[:uid], user[:user_detailed]['prenom'] + ' ' + user[:user_detailed]['nom'], 'admin', carnet.id, 1, 1, 1, 0, evignal
      end
    end
    if right.admin == 1
      carnet.delete_url
    else
      error!("Vous n'êtes pas autorisé pour cette ressource", 401)
    end
  end

  desc 'ouvrir un carnet avec une url publique'
  params {
    requires :url_pub, type: String
  }
  get '/:url_pub' do
    carnet = Carnet.new(nil, nil, nil, nil, nil, params[:url_pub])
    carnet.read
    response = Laclasse::CrossApp::Sender.send_request_signed(:service_annuaire_user, user[:info].uid.to_s, 'expand' => 'true' )
    if response['profil_actif']['etablissement_code_uai'] == UAI_EVIGNAL
      redirect APP_PATH + '/#/evignal/classes/' + carnet.id_classe.to_s + '/carnets/' + carnet.uid_elv
    else
      redirect APP_PATH + '/#/classes/' + carnet.id_classe.to_s + '/carnets/' + carnet.uid_elv
    end
  end
end
