#coding: utf-8
# API pour l'interface des carnets
class EntreesApi < Grape::API
	format :json

	helpers AuthenticationHelpers
    include CarnetsLib

  desc "retourne les entrées d'un onglet"
    params {
        requires :id_onglet, type: Integer, desc: "id de l'onglet"
    }
    get '/' do
      begin
        onglet = Onglet.new(params[:id_onglet])
        onglet.read
        onglet.get_entrees
      rescue Exception => e
        {error: 'Impossible de retourner les entrées'}
      end
    end

    desc "création d'une entrées pour un onglet"
    params {
        requires :id_onglet, type: Integer, desc: "id de l'onglet"
        requires :carnet_id, type: Integer, desc: "id du carnet"
        requires :infos, type: String, desc: 'infos sur le proprietaire de l\'entrée'
        requires :avatar, type: String, desc: 'url de l\'avatar du proprietaire'
        requires :avatar_color, type: String, desc: 'couleur de l\'avatar du proprietaire'
        requires :back_color, type: String, desc: 'couleur de l\'entree'
        requires :uid, type: String, desc: 'uid du proprietaire'
        requires :contenu, type: String, desc: 'contenu de l\'entrée'
    }
    post '/' do
        onglet = Onglet.new(params[:id_onglet])
        docs = []
        begin
            onglet.read
            entree = Entree.new(nil, onglet.id, params[:carnet_id], params[:uid], params[:avatar], params[:avatar_color], params[:back_color], params[:infos], params[:contenu])
            entree.create
            {id: entree.id}
        rescue Exception => e
            LOGGER.error e.message
            {error: "erreur lors de la création de l'entrée"}
        end
    end

    desc "Modif du contenu d'une entrée pour un onglet"
    params {
        requires :id, type: Integer, desc: "id de l'entrée"
        requires :contenu, type: String
        requires :avatar, type: String
    }
    put '/:id' do
        begin
            entree = Entree.new(params[:id])
            entree.read
            entree.update params[:contenu], params[:avatar]
        rescue Exception => e
            {error: "erreur lors de la modification de l'entrée"}
        end
    end

    desc "Modification de l'url de l'avatar des entrées de l'utilisateur"
    params {
        requires :uid, type: String, desc: "uid de l'utilisateur"
        requires :avatar, type: String
    }
    put '/:uid/avatar' do
        begin
            entree = Entree.new(nil,nil,nil, params[:uid])
            entree.update_avatar params[:avatar]
            {good: "mise à jour effectuée"}
        rescue Exception => e
            {error: "erreur lors de la modification de l'entrée"}
        end
    end

    desc "suppression d'une entrée pour un onglet"
    params {
        requires :id, type: Integer, desc: "id de l'entrée"
    }
    delete '/:id' do
        begin
            entree = Entree.new(params[:id])
            entree.read
            entree.delete
        rescue Exception => e
            {error: "erreur lors de la suppression de l'onglet"}
        end
    end


    desc "Upload document pour un message de suivi"
    params {
        requires :id_carnet, type: Integer
        requires :id_entree, type: Integer
        requires :file
    }
    post '/upload' do
        begin
            #Création d'un nouveau nom pour renommer le fichier temporaire uploadé
            new_filename = params[:file][:tempfile].path+"_"+params[:file][:filename]
            File.rename params[:file][:tempfile], new_filename

            #envoi de la requete au documents pour créé le fichier dans l'espace perso de stockage du suivi
            reponse = Laclasse::CrossApp::Sender.post_raw_request_signed(:service_docs_suivi, nil, {}, {uid_current_user: $current_user[:info].uid, id_carnet: params[:id_carnet], file: File.open( new_filename ), nom: params[:file][:filename]}, {"rack.session" => cookies['rack.session']})
            
            #Suppression du fichier temp
            File.delete new_filename

            #s'il n'y a pas d'erreur on insère dans la BDD les coordonnées du docs.
            if reponse["error"].nil?
                doc = Doc.new nil, params[:file][:filename], reponse["md5"], params[:id_entree]
                doc.create
                {docs:[{id: doc.id, nom: doc.nom, md5: doc.url}]}            
            else
                error!("Impossible d'uploader le document", 404)
            end
        rescue Exception => e
            LOGGER.error e.message
            LOGGER.error e.backtrace[0..10].to_s
            error!("Impossible d'uploader le document", 404)
        end
    end

    desc "Upload document pour un message de suivi"
    params {
        requires :id_carnet, type: Integer
        requires :id_entree, type: Integer
        requires :file, type: String
    }
    post '/upload/documents' do
        begin
            #envoi de la requete au documents pour créé le fichier dans l'espace perso de stockage du suivi
            reponse = Laclasse::CrossApp::Sender.post_raw_request_signed(:service_docs_suivi, "copy", {}, {uid_current_user: $current_user[:info].uid, id_carnet: params[:id_carnet], target: params[:file]}, {"rack.session" => cookies['rack.session']})

            #s'il n'y a pas d'erreur on insère dans la BDD les coordonnées du docs.
            if reponse["error"].nil?
                doc = Doc.new nil, reponse["nom"], reponse["md5"], params[:id_entree]
                doc.create
                {docs:[{id: doc.id, nom: doc.nom, md5: doc.url}]}            
            else
                error!("Impossible d'uploader le document", 404)
            end
        rescue Exception => e
            LOGGER.error e.message
            LOGGER.error e.backtrace[0..10].to_s
            error!("Impossible d'uploader le document", 404)
        end
    end

    desc "suppression d'un document d'une entrée"
    params {
        requires :id, type: Integer, desc: "id du document"
        requires :id_carnet, type:Integer
    }
    delete '/delete/docs/:id' do
        begin
            # Récupération des coordonnées du document
            doc = Doc.new(params[:id])
            doc.read

            #On envoie la requete pour la suppression du fichier dans l'espace de stockage du suivi dans les documents
            reponse = Laclasse::CrossApp::Sender.put_request_signed(:service_docs_suivi, params[:id_carnet].to_s+'/'+doc.url, {}, {nom: doc.nom}, {"rack.session" => cookies['rack.session']})

            #Si la suppression s'est déroulé correctement on supprime les coordonnées dans la bdd
            if reponse['error'].nil?
                doc.delete
            else
                error!("Impossible de supprimer le document", 404)
            end
        rescue Exception => e
            LOGGER.error e.message
            LOGGER.error e.backtrace[0..10].to_s
            error!("Impossible de supprimer le document", 404)
        end
    end

    desc "récupération d'un document d'une entrée"
    params {
        requires :id, type: Integer, desc: "id du document"
        requires :id_carnet, type:Integer
    }
    get '/docs/:id' do
        begin
            # Récupération des coordonnées du document
            doc = Doc.new(params[:id])
            doc.read

            #on envoi la requete pour récupérer le fichier qui se trouve dans l'espace de stockage du suivi dans les documents
            reponse = Laclasse::CrossApp::Sender.send_request_signed(:service_docs_suivi, params[:id_carnet].to_s+'/'+doc.url, {nom: doc.nom}, {"rack.session" => cookies['rack.session']})

            #on retourne le contenu sous forme de blob pour le client.
            if reponse['error'].nil?
                content_type reponse.headers[:content_type]
                header['Content-Disposition'] = "attachment; filename="+doc.nom
                header['Content-Length'] = reponse.size
                env['api.format'] = :binary
                reponse
            else
                error!("Impossible de récupérer le document", 404)
            end
        rescue Exception => e
            LOGGER.error e.message
            LOGGER.error e.backtrace[0..10].to_s
            error!("Impossible de récupérer le document", 404)
        end
    end
end