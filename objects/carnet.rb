# coding: utf-8
require 'logger'

# Ojbet carnet de suivi
class Carnet
  attr_accessor :url_pub, :evignal

  attr_reader :id, :uid_elv, :uid_adm, :uai, :id_classe, :date_creation

  def initialize( id = nil,
                  uid_elv = nil,
                  uid_adm = nil,
                  uai = nil,
                  id_classe = nil,
                  url_pub = nil,
                  evignal = false )
    @id = id
    @uid_elv = uid_elv
    @uid_adm = uid_adm
    @uai = uai
    @id_classe = id_classe
    @date_creation = nil
    @url_pub = url_pub
    @evignal = evignal
    @logger = Logger.new(STDOUT)
  end

  def create
    @date_creation = Time.now
    new_carnet = Carnets.new
    new_carnet.uid_elv = @uid_elv
    new_carnet.uid_adm = @uid_adm
    new_carnet.uai = @uai
    new_carnet.cls_id = @id_classe
    new_carnet.url_publique = @url_pub
    new_carnet.date_creation = @date_creation
    new_carnet.evignal = @evignal
    # les droits a voir par la suite
    new_carnet = new_carnet.save
    @id = new_carnet.id
  end

  def read
    carnet = Carnets[id: @id] unless @id.nil?
    carnet = Carnets[uid_elv: @uid_elv] if !@uid_elv.nil? && @id.nil?
    carnet = Carnets[url_publique: @url_pub] if !@url_pub.nil? && carnet.nil?

    @id = carnet.id
    @uid_elv = carnet.uid_elv
    @uid_adm = carnet.uid_adm
    @uai = carnet.uai
    @id_classe = carnet.cls_id
    @url_pub = carnet.url_publique
    @date_creation = carnet.date_creation
    @evignal = carnet.evignal
  end

  def update(evignal = nil, url_pub = nil)
    carnet = Carnets[id: @id] unless @id.nil?
    carnet = Carnets[uid_elv: @uid_elv] if !@uid_elv.nil? && @id.nil?

    carnet.update(evignal: evignal) unless evignal.nil?
    @evignal = evignal unless evignal.nil?
    carnet.update(url_publique: url_pub) unless url_pub.nil?
    @url_pub = url_pub unless url_pub.nil?
    # UPDATE CLASSE POUR LES ANNEES SUIVANTES
  end

  def delete_url
    carnet = Carnets[id: @id] unless @id.nil?
    carnet = Carnets[uid_elv: @uid_elv] if !@uid_elv.nil? && @id.nil?

    carnet.update(url_publique: nil)
    @url_pub = nil
    # VOIR SI POSIBILITE DE DELETE LE CARNET
  end

  def exist?
    carnet = Carnets[id: @id] unless @id.nil?
    carnet = Carnets[uid_elv: @uid_elv] if !@uid_elv.nil? && @id.nil?
    carnet.nil? ? false : true
  end

  def onglets
    onglets = []
    onglets_bdd = CarnetsOnglets.where(carnets_id: @id)

    onglets_bdd.each do |o|
      onglet = Onglet.new(o.onglets_id)
      onglet.read
      onglets.push onglet
    end
    onglets
  end

  def entrees
    entrees = []
    entrees_bdd = Saisies.where(carnets_id: @id)

    entrees_bdd.each do |e|
      entree = Entree.new(e.id)
      entree.read
      entrees.push entree
    end

    entrees
  end

  def get_rights(evignal)
    rights = []
    rights_bdd = if evignal == -1
                   DroitsSpecifiques.where(carnets_id: @id)
                 else
                   DroitsSpecifiques.where(carnets_id: @id, evignal: evignal)
                 end

    rights_bdd.each do |r|
      right = Right.new(r.id)
      right.select
      rights.push right
    end
    rights
  end

  def get_pers_evignal_or_hopital(evignal = true, hopital = false)
    rights = []
    rights_bdd = DroitsSpecifiques.where(carnets_id: @id, hopital: hopital, evignal: evignal)

    rights_bdd.each do |r|
      right = Right.new(r.id)
      right.select
      rights.push right
    end
    rights
  end
end
