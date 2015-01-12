#coding: utf-8
# API pour l'interface pour les urls publiques
class PublicUrlApi < Grape::API
	format :json
  content_type :json, "application/json"
	helpers AuthenticationHelpers
  include CarnetsLib

  desc 'création d\'une url public d\'un carnet'
  params{
      requires :uid_elv, type: String
      requires :id_onglets, type: Array
  }
  post '/carnets/:uid_elv' do
      begin        
        response = $current_user[:user_detailed]
        carnet = Carnet.new(nil, params[:uid_elv])
        carnet.read
        #verification des droits coté backend
        right =  Right.new nil, $current_user[:info].uid.to_s, nil, nil, carnet.id
        begin
          right.select          
        rescue Exception => e
          response["profil_actif"]["etablissement_code_uai"] == UAI_EVIGNAL ? evignal = 1 : evignal = 0
          if (response["profil_actif"]["etablissement_code_uai"] == carnet.uai || evignal == 1) && response["roles_max_priority_etab_actif"] > 1
            right = Right.new nil, params[:uid], response["prenom"]+" "+response["nom"], "admin", carnet.id, 1, 1, 1, 0, evignal
          end
        end
        puts right.inspect
        if right.admin == 1
          message = carnet.uid_elv+'_'+carnet.uid_adm+'_'+carnet.uai+'_'+carnet.date_creation.to_s+'_'+Time.now.to_s
          URL_ENT.split('').last == '/' ? prefix_url = URL_ENT.chomp('/') : prefix_url = URL_ENT
          url_pub = Outils::md5_encode message
          carnet.update(nil, url_pub)
          params[:id_onglets].each do |o|
            onglet = Onglet.new o['id']
            onglet.read
            onglet.update nil, nil, url_pub
          end
          # {url_pub: prefix_url + APP_PATH + '/public/' + url_pub} #TODO remettre pour la prod
          {url_pub: 'http://localhost:9292' + APP_PATH + '/public/' + url_pub}
        else
          error!("Vous n'êtes pas autorisé pour cette ressource", 401)
        end
      rescue Exception => e
        puts e.message
        p e.backtrace[0..10]
        {error: "Impossible de générer l'url publique"}
      end
  end

  desc 'suppression d\'une url public d\'un carnet'
  params{
      requires :uid_elv, type: String
  }
  delete '/carnets/:uid_elv' do
    begin     
      response = $current_user[:user_detailed]   
      carnet = Carnet.new(nil, params[:uid_elv])
      carnet.read
      #verification des droits coté backend
      right = Right.new nil, $current_user[:info].uid.to_s, nil, nil, carnet.id
      begin
        right.select        
      rescue Exception => e
        response["profil_actif"]["etablissement_code_uai"] == UAI_EVIGNAL ? evignal = 1 : evignal = 0
        if (response["profil_actif"]["etablissement_code_uai"] == carnet.uai || evignal == 1) && response["roles_max_priority_etab_actif"] > 1
          right = Right.new nil, params[:uid], response["prenom"]+" "+response["nom"], "admin", carnet.id, 1, 1, 1, 0, evignal
        end
      end
      puts right.inspect
      if right.admin == 1
        carnet.deleteUrl
      else
        error!("Vous n'êtes pas autorisé pour cette ressource", 401)
      end
    rescue Exception => e
      puts e.message
      p e.backtrace[0..10]
      {error: "Impossible de générer l'url publique"}
    end
  end

  # desc 'ouvrir un carnet avec une url publique'
  # params{
  #     requires :url_pub, type: String
  # }
  # get '/:url_pub' do
  #     begin
  #       carnet = Carnet.new(nil, nil, nil, nil, nil, params[:url_pub])
  #       carnet.read
  #       response = Laclasse::Annuaire.send_request_signed(:service_annuaire_user, $current_user[:info].uid.to_s, {"expand" => "true"})
  #       if response["profil_actif"]["etablissement_code_uai"] == UAI_EVIGNAL
  #         redirect APP_PATH + "/#/evignal/classes/"+carnet.id_classe.to_s+"/carnets/"+carnet.uid_elv
  #       else
  #         redirect APP_PATH + "/#/classes/"+carnet.id_classe.to_s+"/carnets/"+carnet.uid_elv
  #       end
  #     rescue Exception => e
  #       puts e.message
  #       puts e.backtrace[0..10]
  #         error!('Ressource non trouvee', 404)
  #     end
  # end
end