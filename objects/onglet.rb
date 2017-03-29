# coding: utf-8
require 'logger'

# Classe de gestion des onglets du carnet
class Onglet
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
      @date_creation = Time.now
      new_tabs = Onglet.new
      new_tabs.nom = @nom
      new_tabs.uid_own = @uid_own
      new_tabs.date_creation = @date_creation
      new_tabs.url_publique = @url_pub
      new_tabs = new_tabs.save
      @id = new_tabs.id
      lie_carnet
  end

  def lie_carnet
    new_liaison = CarnetOnglet.new
    new_liaison.carnets_id = @id_carnet
    new_liaison.onglets_id = @id
    new_liaison.ordre = @ordre
    new_liaison.save
    @id
  end

  def read
    onglet = Onglet[id: @id]
    liaison = CarnetOnglet[onglets_id: @id]

    @id_carnet = liaison.carnets_id unless liaison.nil?
    @nom = onglet.nom
    @uid_own = onglet.uid_own
    @date_creation = onglet.date_creation
    @ordre = liaison.ordre unless liaison.nil?
    @url_pub = onglet.url_publique
  end

  def update(nom = nil, ordre = nil, url_pub = nil)
    onglet = Onglet[id: @id]
    onglet.update(nom: nom) unless nom.nil?
    onglet.update(url_publique: url_pub) unless url_pub.nil?
    CarnetOnglet[carnets_id: @id_carnet, onglets_id: @id].update(ordre: ordre) unless ordre.nil?
    @ordre = ordre unless ordre.nil?
    @url_pub = url_pub unless url_pub.nil?
    @nom = nom unless nom.nil?
  end

  def delete
    onglet = Onglet[id: @id]

    delete_entrees
    delie_carnet
    onglet.delete
  rescue Exception
    lie_carnet if CarnetOnglet[onglets_id: @id, carnets_id: @id_carnet].nil? && !Onglet[id: @id].nil?
    create if Onglet[id: @id].nil?
  end

  def delete_url
    onglet = Onglet[id: @id]
    onglet.update(url_publique: nil)
  end

  def delie_carnet
    CarnetOnglet.where(onglets_id: @id).delete
  end

  def entrees
    entrees = []
    entrees_bdd = EntreesOnglet.where(onglets_id: @id)
    entrees_bdd.each do |e|
      entree = Entree.new(e.saisies_id)
      entree.read
      if entree.id_carnet == @id_carnet && entree.id_onglet == @id
        entrees.push entree
      end
    end
    entrees
  end

  def delete_entrees
    entrees_bdd = EntreesOnglet.where(onglets_id: @id)
    entrees_bdd.each do |e|
      entree = Entree.new(e.saisies_id)
      entree.read
      entree.delete
    end
  end
end
