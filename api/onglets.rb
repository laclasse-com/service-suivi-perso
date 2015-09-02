# coding: utf-8
# API pour l'interface des carnets
class OngletsApi < Grape::API
  format :json

  helpers AuthenticationHelpers
  include CarnetsLib

  desc 'retourne tout les onglets et les entrees assocciés à un carnet'
  params do
    requires :uid, type: String, desc: "uid de l'élève"
  end
  get '/' do
    begin
      onglets = CarnetsLib.tab_list params[:uid]
      {onglets: onglets}
    rescue Exception
      {error: 'Impossible de retourner les onglets'}
    end
  end

  desc "retourne juste le nom et l'id des onglets du carnet"
  params do
    requires :uid, type: String, desc: "uid de l'élève"
  end
  get '/tabs' do
    carnet = Carnet.new(nil, params[:uid])
    begin
      onglets = []
      carnet.read
      carnet.onglets.each do |onglet|
        onglets.push(id: onglet.id, nom: onglet.nom, check: false)
      end
      {onglets: onglets}
  rescue Exception
    {error: 'Impossible de retourner les onglets'}
    end
  end

  desc "création d'un onglet pour un carnet"
  params do
    requires :uid, type: String, desc: "uid de l'élève"
    requires :nom, type: String, desc: 'nom du nouvel onglet'
  end
  post '/' do
    carnet = Carnet.new(nil, params[:uid])
    begin
      carnet.read
      ordre = carnet.onglets.size + 1
      onglet = Onglet.new(nil, carnet.id, params[:nom], env['rack.session'][:current_user][:info].uid.to_s, ordre)
      onglet.create
      {id: onglet.id, carnet_id: onglet.id_carnet, ordre: onglet.ordre, owner: onglet.uid_own}
  rescue Exception
    {error: "erreur lors de la création de l'onglet"}
    end
  end

  desc "Modif d'un onglet pour un carnet"
  params do
    requires :id, type: Integer, desc: "id de l'onglet"
    optional :nom, type: String
    optional :ordre, type: Integer
  end
  put '/:id' do
    begin
      onglet = Onglet.new(params[:id])
      onglet.read
      onglet.update params[:nom], params[:ordre]
  rescue Exception
    {error: "erreur lors de la modification de l'onglet"}
    end
  end

  desc "suppression d'un onglet pour un carnet"
  params do
    requires :id, type: Integer, desc: "id de l'onglet"
  end
  delete '/:id' do
    begin
      onglet = Onglet.new(params[:id])
      onglet.read
      onglet.delete
  rescue Exception
    {error: "erreur lors de la suppression de l'onglet"}
    end
  end
end
