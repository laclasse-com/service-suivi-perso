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
        begin
            onglet.read
            entree = Entree.new(nil, onglet.id, params[:carnet_id], params[:uid], params[:avatar], params[:avatar_color], params[:back_color], params[:infos], params[:contenu])
            entree.create
            {id: entree.id}
        rescue Exception => e
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
        requires :file, type: Object
    }
    post '/upload' do
        begin
            new_filename = params[:file][:tempfile].path+"_"+params[:file][:filename]
            File.rename params[:file][:tempfile], new_filename

            # # Annuaire.post_raw_request_signed( :service_annuaire_user, "#{uid}/upload/avatar",
            #                                 {},
            #                                 image: File.open( new_filename ) )

            File.delete new_filename
            {nom: params[:file][:filename], md5:"dhdsqkjfkie54564ds6f4ds"}            
        rescue Exception => e
            puts e.message
            puts e.backtrace[0..10].inspect
            error!("Impossible d'uploader le document", 404)
        end
    end
end