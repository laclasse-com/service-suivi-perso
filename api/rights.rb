#coding: utf-8
# API pour l'interface des carnets
class RightsApi < Grape::API
	format :json

	helpers AuthenticationHelpers
  include CarnetsLib

   desc "retourne un droit avec l'id"
    params {
        requires :id, type: Integer, desc: "id du droit"
    }
    get '/' do
      begin
        right = Right.new(params[:id])
        right.select
        {id: right.id, uid: right.uid, full_name: right.full_name, profil: right.profil, read: right.read, write: right.write, admin: right.admin}
      rescue Exception => e
        {error: 'Impossible de retourner le droit'}
      end
    end

    desc "retourne un droit d'un utilisateur"
    params {
        requires :uid, type: String, desc: "uid d'un utilisateur"
        optional :uid_elv, type: String
        optional :carnet_id, type: Integer
    }
    get '/users/:uid' do
      begin
        response = Laclasse::CrossAppSender.send_request_signed(:service_annuaire_user, params[:uid], {"expand" => "true"})
        carnet = Carnet.new(params[:carnet_id], params[:uid_elv])
        carnet.read
        right = Right.new(nil, params[:uid], nil, nil, carnet.id)
        begin
          right.select          
        rescue Exception => e
          response["profil_actif"]["etablissement_code_uai"] == UAI_EVIGNAL ? evignal = 1 : evignal = 0
          if (response["profil_actif"]["etablissement_code_uai"] == carnet.uai || evignal == 1) && response["roles_max_priority_etab_actif"] > 1
            right = Right.new nil, params[:uid], response["prenom"]+" "+response["nom"], "admin", carnet.id, 1, 1, 1, 0, evignal
          end
        end
        URL_ENT.split('').last == '/' ? prefix_url = URL_ENT.chomp('/') : prefix_url = URL_ENT
        # prefix_url = 'http://localhost:9292' #TODO a enlever pour la
        url_pub = prefix_url + APP_PATH + '/public/' + carnet.url_pub if !carnet.url_pub.nil?
        {id: right.id, uid: right.uid, full_name: right.full_name, profil: right.profil, read: right.read, write: right.write, admin: right.admin, url_pub: url_pub} #TODO remettre prefix pour prod
      rescue Exception => e
        puts e.message
        puts e.backtrace[0..10].inspect
        {error: 'Impossible de retourner le droit pour un utilisateur'}
      end
    end

    desc "retourne les droits pour un carnet"
    params {
        requires :uid_elv, type: String, desc: "uid du carnet"
        optional :evignal, type: Integer
    }
    get '/carnets/:uid_elv' do
      carnet = Carnet.new(nil, params[:uid_elv])
      !params[:evignal].nil? ? evignal = params[:evignal] : evignal = 0
      begin
        carnet.read
        rights = []
        carnet.get_rights(evignal).each do |right|
          rights.push({
            id: right.uid,
            id_right: right.id,
            full_name: right.full_name,
            profil: right.profil,
            r: right.read == 1 ? true : false,
            w: right.write == 1 ? true : false,
            admin: right.admin == 1 ? true : false,
            hopital: right.hopital,
            evignal: right.evignal
          })
        end
        {data: rights}
      rescue Exception => e
        {error: 'Impossible de retourner les droits pour un carnet'}
      end
    end

    desc "création d'un droit"
    params {
        requires :uid, type: String, desc: "uid d'un utilisateur"
        requires :uid_elv, type: String, desc: "uid de l'élève"
        requires :full_name, type: String, desc: "nom et prenom de l'utulisateur"
        requires :profil, type: String, desc: "profil de l'utulisateur"
        requires :read, type: Boolean, desc: "droit de lecture"
        requires :write, type: Boolean, desc: "droit d'ecriture"
    }
    post '/' do
      !params[:hopital].nil? ? hopital = params[:hopital] : hopital = 0
      !params[:evignal].nil? ? evignal = params[:evignal] : evignal = 0
      carnet = Carnet.new(nil, params[:uid_elv])
      begin
        carnet.read
        r = params[:read] ? 1 : 0
        w = params[:write] ? 1 : 0
        admin = 0
        hopital = 0
        evignal = 0
        right = Right.new(nil, params[:uid], params[:full_name], params[:profil], carnet.id, r, w, admin, hopital, evignal)
        right.create
        {id: right.id, uid: right.uid, full_name: right.full_name, profil: right.profil, read: right.read, write: right.write, admin: admin, hopital: hopital, evignal: evignal}
      rescue Exception => e
        {error: 'Impossible de créer le droit'}
      end
    end

    desc "création, mise à jour ou suppression d'un droit"
    params {
      requires :uid_elv, type: String
      requires :users, type: Array, desc: "les utilisateurs ou l'on doit effectuer une action"
    }
    post '/cud/' do
        carnet = Carnet.new(nil, params[:uid_elv])
      begin
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
            if !user.id_right.nil?
              right = Right.new(user.id_right)
              right.select
              right.update r, w, admin
            end
          when 'delete'
            if !user.id_right.nil?
              right = Right.new(user.id_right)
              right.select
              right.delete
            end
          end
        end
        {}
      rescue Exception => e
        {error: 'Impossible d\'enregister les changements sur les droits du carnet'}
      end
    end

    desc "mise à jour d'un droit"
    params {
        requires :id, type: Integer, desc: "id du droit"
        optional :read, type: Integer, desc: "droit de lecture"
        optional :write, type: Integer, desc: "droit d'ecriture"
    }
    put '/:id' do
        right = Right.new(params[:id])
      begin
        right.select
        right.update(params[:read], params[:write])
        {id: right.id, uid: right.uid, full_name: right.full_name, profil: right.profil, read: right.read, write: right.write}
      rescue Exception => e
        {error: 'Impossible de mettre à jour le droit'}
      end
    end

    desc "supprimer d'un droit"
    params {
        requires :id, type: Integer, desc: "id du droit"
    }
    delete '/:id' do
        right = Right.new(params[:id])
      begin
        right.delete
      rescue Exception => e
        {error: 'Impossible de supprimer le droit'}
      end
    end
end
