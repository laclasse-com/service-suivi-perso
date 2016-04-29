# coding: utf-8
require 'logger'

# Classe de gestion des onglets du carnet
class Onglet
  include Outils
  include ErrorHandler

  attr_accessor :nom, :ordre, :url_pub

  attr_reader :id, :id_carnet, :uid_own, :date_creation

  def initialize(id = nil, id_carnet = nil, nom = nil, uid_own = nil, ordre = 1, url_pub = nil)
    @id = id
    @id_carnet = id_carnet
    @nom = nom
    @uid_own = uid_own
    @date_creation = nil
    @ordre = ordre
    @url_pub = url_pub
    @logger = Logger.new(STDOUT)
  end

  def create
    requires({ nom: @nom }, :nom)
    requires({ uid_own: @uid_own }, :uid_own)
    begin
      @date_creation = Time.now
      new_tabs = Onglets.new
      new_tabs.nom = @nom
      new_tabs.uid_own = @uid_own
      new_tabs.date_creation = @date_creation
      new_tabs.url_publique = @url_pub
      new_tabs = new_tabs.save
      @id = new_tabs.id
      lie_carnet
    rescue Exception
      raise_crud_error
      raise_crud_error 'create', "la création d'un onglet", 'Onglet'
    end
  end

  def lie_carnet
    requires({ id_carnet: @id_carnet }, :id_carnet)
    requires({ id_onglet: @id }, :id_onglet)
    begin
      new_liaison = CarnetsOnglets.new
      new_liaison.carnets_id = @id_carnet
      new_liaison.onglets_id = @id
      new_liaison.ordre = @ordre
      new_liaison.save
      @id
    rescue Exception
      raise_crud_error
      raise_crud_error 'lie_carnet', 'lier un carnet à un onglet', 'Onglet'
    end
  end

  def read
    requires({ id: @id }, :id)
    onglet = Onglets[id: @id]
    liaison = CarnetsOnglets[onglets_id: @id]
    requires({ onglet: onglet }, :onglet)
    begin
      @id_carnet = liaison.carnets_id unless liaison.nil?
      @nom = onglet.nom
      @uid_own = onglet.uid_own
      @date_creation = onglet.date_creation
      @ordre = liaison.ordre unless liaison.nil?
      @url_pub = onglet.url_publique
    rescue Exception
      raise_crud_error 'read', "la récupération d'un onglet", 'Onglet'
    end
  end

  def update(nom = nil, ordre = nil, url_pub = nil)
    requires({ id: @id }, :id)
    requires({ id_carnet: @id_carnet }, :id_carnet)
    onglet = Onglets[id: @id]
    requires({ onglet: onglet }, :onglet)
    begin
      onglet.update(nom: nom) unless nom.nil?
      onglet.update(url_publique: url_pub) unless url_pub.nil?
      CarnetsOnglets[carnets_id: @id_carnet, onglets_id: @id].update(ordre: ordre) unless ordre.nil?
      @ordre = ordre unless ordre.nil?
      @url_pub = url_pub unless url_pub.nil?
      @nom = nom unless nom.nil?
    rescue Exception
      raise_crud_error 'update', "lier mise à jour d'un onglet", 'Onglet'
    end
  end

  def delete
    requires({ id: @id }, :id)
    requires({ id_carnet: @id_carnet }, :id_carnet)
    onglet = Onglets[id: @id]
    requires({ onglet: onglet }, :onglet)
    begin
      delete_entrees
      delie_carnet
      onglet.delete
    rescue Exception
      lie_carnet if CarnetsOnglets[onglets_id: @id, carnets_id: @id_carnet].nil? && !Onglets[id: @id].nil?
      create if Onglets[id: @id].nil?
      raise_crud_error 'delete', "la suppression d'un onglet", 'Onglet'
    end
  end

  def delete_url
    requires({ id: @id }, :id)
    onglet = Onglets[id: @id]
    requires({ onglet: onglet }, :onglet)
    begin
      onglet.update(url_publique: nil)
    rescue Exception
      raise_crud_error 'delete_url', "la suppression de l'url publique", 'Onglet'
    end
  end

  def delie_carnet
    requires({ id: @id }, :id)
    begin
      CarnetsOnglets.where(onglets_id: @id).delete
    rescue Exception
      raise_crud_error 'delie_carnet', 'delier un carnet à un onglet', 'Onglet'
    end
  end

  def entrees
    requires({ id: @id }, :id)
    entrees = []
    entrees_bdd = EntreesOnglets.where(onglets_id: @id)
    begin
      entrees_bdd.each do |e|
        entree = Entree.new(e.saisies_id)
        entree.read
        if entree.id_carnet == @id_carnet && entree.id_onglet == @id
          entrees.push entree
        end
      end
    rescue Exception
      raise_crud_error 'entrees', "récupération des entrées d'un onglet", 'Onglet'
    end
    entrees
  end

  def delete_entrees
    requires({ id: @id }, :id)
    entrees_bdd = EntreesOnglets.where(onglets_id: @id)
    begin
      entrees_bdd.each do |e|
        entree = Entree.new(e.saisies_id)
        entree.read
        entree.delete
      end
    rescue Exception
      raise_crud_error 'delete_entrees', "la suppression des entrées d'un onglet", 'Onglet'
    end
  end
end
