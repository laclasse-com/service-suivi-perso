#coding: utf-8
# API pour l'interface des carnets
class OngletsApi < Grape::API
	format :json

	helpers AuthenticationHelpers
    include CarnetsLib

  desc "retourne tout les onglets et les entrees assocciés à un carnet"
    params {
        requires :uid, type: String, desc: "uid de l'élève"
    }
    get '/' do
      begin
        onglets = CarnetsLib.get_tabs params[:uid]
        {onglets: onglets}
      rescue Exception => e
        {error: 'Impossible de retourner les onglets'}
      end
    end

    desc "création d'un onglet pour un carnet"
    params {
        requires :uid, type: String, desc: "uid de l'élève"
        requires :nom, type: String, desc: 'nom du nouvel onglet'
    }
    post '/' do
        carnet = Carnet.new(nil,params[:uid])
        begin
            carnet.read
            ordre = carnet.get_onglets.size + 1
            onglet = Onglet.new(nil, carnet.id, params[:nom], $current_user[:info].uid.to_s, ordre)
            onglet.create
            {id: onglet.id, id_carnet: onglet.id_carnet, ordre: onglet.ordre}
        rescue Exception => e
            {error: "erreur lors de la création de l'onglet"}
        end
    end

    desc "Modif d'un onglet pour un carnet"
    params {
        requires :id, type: Integer, desc: "id de l'onglet"
        optional :nom, type: String
        optional :ordre, type: Integer
    }
    put '/:id' do
        begin
            onglet = Onglet.new(params[:id])
            onglet.read
            onglet.update params[:nom], params[:ordre]
        rescue Exception => e
            {error: "erreur lors de la modification de l'onglet"}
        end
    end

    desc "suppression d'un onglet pour un carnet"
    params {
        requires :id, type: Integer, desc: "id de l'onglet"
    }
    delete '/:id' do
        begin
            onglet = Onglet.new(params[:id])
            onglet.read
            onglet.delete
        rescue Exception => e
            {error: "erreur lors de la suppression de l'onglet"}
        end
    end
end