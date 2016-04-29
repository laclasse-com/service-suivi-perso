# coding: utf-8
# API pour l'interface des carnets
class RightsApi < Grape::API
  format :json

  helpers URLHelpers
  include CarnetsLib

  desc "retourne un droit avec l'id"
  params do
    requires :id, type: Integer, desc: 'id du droit'
  end
  get do
    right = Right.new( params[:id] )
    right.select
    { id: right.id,
      uid: right.uid,
      full_name: right.full_name,
      profil: right.profil,
      read: right.read,
      write: right.write,
      admin: right.admin }
  end

  desc "retourne un droit d'un utilisateur"
  params do
    requires :uid, type: String, desc: "uid d'un utilisateur"
    optional :uid_elv, type: String
    optional :carnet_id, type: Integer
  end
  get '/users/:uid' do
    response = Laclasse::CrossApp::Sender.send_request_signed( :service_annuaire_user, params[:uid], 'expand' => 'true' )
    carnet = Carnet.new( params[:carnet_id], params[:uid_elv] )
    carnet.read
    right = Right.new( nil, params[:uid], nil, nil, carnet.id )

    begin
      right.select
    rescue Exception
      evignal = response['profil_actif']['etablissement_code_uai'] == UAI_EVIGNAL ? 1 : 0
      if (response['profil_actif']['etablissement_code_uai'] == carnet.uai || evignal == 1) && response['roles_max_priority_etab_actif'] > 1
        right = Right.new nil, params[:uid], response['prenom'] + ' ' + response['nom'], 'admin', carnet.id, 1, 1, 1, 0, evignal
      end
    end

    prefix_url = URL_ENT
    prefix_url.chomp!('/') if URL_ENT.split('').last == '/'

    url_pub = prefix_url + APP_PATH + '/public/' + carnet.url_pub unless carnet.url_pub.nil?

    { id: right.id,
      uid: right.uid,
      full_name: right.full_name,
      profil: right.profil,
      read: right.read,
      write: right.write,
      admin: right.admin,
      url_pub: url_pub }
  end

  desc 'retourne les droits pour un carnet'
  params do
    requires :uid_elv, type: String, desc: 'uid du carnet'
    optional :evignal, type: Integer
  end
  get '/carnets/:uid_elv' do
    carnet = Carnet.new(nil, params[:uid_elv])
    evignal = !params[:evignal].nil? ? params[:evignal] : 0

    carnet.read
    rights = []
    carnet.get_rights(evignal).each do |right|
      rights.push( id: right.uid,
                   id_right: right.id,
                   full_name: right.full_name,
                   profil: right.profil,
                   r: right.read == 1,
                   w: right.write == 1,
                   admin: right.admin == 1,
                   hopital: right.hopital,
                   evignal: right.evignal )
    end

    { data: rights }
  end

  desc "création d'un droit"
  params do
    requires :uid, type: String, desc: "uid d'un utilisateur"
    requires :uid_elv, type: String, desc: "uid de l'élève"
    requires :full_name, type: String, desc: "nom et prenom de l'utulisateur"
    requires :profil, type: String, desc: "profil de l'utulisateur"
    requires :read, type: Boolean, desc: 'droit de lecture'
    requires :write, type: Boolean, desc: "droit d'ecriture"
  end
  post '/' do
    hopital = !params[:hopital].nil? ? params[:hopital] : 0
    evignal = !params[:evignal].nil? ? params[:evignal] : 0
    carnet = Carnet.new(nil, params[:uid_elv])

    carnet.read
    r = params[:read] ? 1 : 0
    w = params[:write] ? 1 : 0
    admin = 0
    # hopital = 0
    # evignal = 0
    right = Right.new(nil, params[:uid], params[:full_name], params[:profil], carnet.id, r, w, admin, hopital, evignal)
    right.create
    {id: right.id, uid: right.uid, full_name: right.full_name, profil: right.profil, read: right.read, write: right.write, admin: admin, hopital: hopital, evignal: evignal}
  end

  desc "création, mise à jour ou suppression d'un droit"
  params do
    requires :uid_elv, type: String
    requires :users, type: Array, desc: "les utilisateurs ou l'on doit effectuer une action"
  end
  post '/cud/' do
    carnet = Carnet.new(nil, params[:uid_elv])
    carnet.read

    params[:users].each do |user|
      r = user.r ? 1 : 0
      w = user.w ? 1 : 0
      admin = user.admin ? 1 : 0
      hopital = user.hopital ? 1 : 0
      evignal = user.evignal ? 1 : 0

      case user.action.last
      when 'add'
        if user.id_right.nil?
          right = Right.new(nil, user.id, user.full_name, user.profil, carnet.id, r, w, admin, hopital, evignal)
          right.create
        end
      when 'update'
        unless user.id_right.nil?
          right = Right.new(user.id_right)
          right.select
          right.update r, w, admin
        end
      when 'delete'
        unless user.id_right.nil?
          right = Right.new(user.id_right)
          right.select
          right.delete
        end
      end
    end
  end

  desc "mise à jour d'un droit"
  params do
    requires :id, type: Integer, desc: 'id du droit'
    optional :read, type: Integer, desc: 'droit de lecture'
    optional :write, type: Integer, desc: "droit d'ecriture"
  end
  put '/:id' do
    right = Right.new(params[:id])

    right.select
    right.update(params[:read], params[:write])

    { id: right.id,
      uid: right.uid,
      full_name: right.full_name,
      profil: right.profil,
      read: right.read,
      write: right.write }
  end

  desc "supprimer d'un droit"
  params do
    requires :id, type: Integer, desc: 'id du droit'
  end
  delete '/:id' do
    right = Right.new(params[:id])

    right.delete
  end
end
