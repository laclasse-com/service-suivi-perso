#coding: utf-8
require 'logger'

class Carnet

  include Outils

  attr_accessor :url_pub, :evignal

  attr_reader :id, :uid_elv, :uid_adm, :uai, :id_classe, :date_creation

  def initialize id=nil, uid_elv=nil, uid_adm=nil, uai=nil, id_classe=nil, url_pub=nil, evignal=false
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
    requires({:uid_elv => @uid_elv}, :uid_elv)
    requires({:uid_adm => @uid_adm}, :uid_adm)
    requires({:uai => @uai}, :uai)
    requires({:id_classe => @id_classe}, :id_classe)
    begin
      @date_creation = Time.now
      new_carnet = Carnets.new
      new_carnet.uid_elv = @uid_elv
      new_carnet.uid_adm = @uid_adm
      new_carnet.uai = @uai
      new_carnet.cls_id = @id_classe
      new_carnet.url_publique = @url_pub
      new_carnet.date_creation = @date_creation
      new_carnet.evignal = @evignal
      #les droits a voir par la suite
      new_carnet = new_carnet.save
      @id = new_carnet.id
    rescue
      @logger.error MSG[LANG.to_sym][:error][:crud].sub("$1", "create").sub("$2", "Carnet").sub("$3", "la création d'un carnet")
      raise MSG[LANG.to_sym][:error][:crud].sub("$1", "create").sub("$2", "Carnet").sub("$3", "la création d'un carnet")
    end
  end

  def read
    carnet = Carnets[:id => @id] if !@id.nil?
    carnet = Carnets[:uid_elv => @uid_elv] if !@uid_elv.nil? && @id.nil?
    carnet = Carnets[:url_publique => @url_pub] if !@url_pub.nil? && carnet.nil?
    requires({:carnet => carnet}, :carnet)
    begin
      @id = carnet.id
      @uid_elv = carnet.uid_elv
      @uid_adm = carnet.uid_adm
      @uai = carnet.uai
      @id_classe = carnet.cls_id
      @url_pub = carnet.url_publique
      @date_creation = carnet.date_creation
      @evignal = carnet.evignal
    rescue 
      @logger.error MSG[LANG.to_sym][:error][:crud].sub("$1", "read").sub("$2", "Carnet").sub("$3", "la récupération du carnet")
      raise MSG[LANG.to_sym][:error][:crud].sub("$1", "read").sub("$2", "Carnet").sub("$3", "la récupération du carnet")
    end
  end

  def update evignal=nil, url_pub=nil
    carnet = Carnets[:id => @id] if !@id.nil?
    carnet = Carnets[:uid_elv => @uid_elv] if !@uid_elv.nil? && @id.nil?
    requires({:carnet => carnet}, :carnet)
    begin
      carnet.update(:evignal => evignal) if !evignal.nil?
      @evignal = evignal if !evignal.nil?
      carnet.update(:url_publique => url_pub) if !url_pub.nil?
      @url_pub = url_pub if !url_pub.nil?
    rescue Exception => e
      @logger.error MSG[LANG.to_sym][:error][:crud].sub("$1", "update").sub("$2", "Carnet").sub("$3", "la mise à jour")
      raise MSG[LANG.to_sym][:error][:crud].sub("$1", "update").sub("$2", "Carnet").sub("$3", "la mise à jour")
    end
    # UPDATE CLASSE POUR LES ANNEES SUIVANTES
  end

  def deleteUrl
    carnet = Carnets[:id => @id] if !@id.nil?
    carnet = Carnets[:uid_elv => @uid_elv] if !@uid_elv.nil? && @id.nil?
    requires({:carnet => carnet}, :carnet)
    begin
      carnet.update(:url_publique => nil)
      @url_pub = nil
    rescue Exception => e
      @logger.error MSG[LANG.to_sym][:error][:crud].sub("$1", "deleteUrl").sub("$2", "Carnet").sub("$3", "la suppression de l'url")
      raise MSG[LANG.to_sym][:error][:crud].sub("$1", "deleteUrl").sub("$2", "Carnet").sub("$3", "la suppression de l'url")
    end
    #VOIR SI POSIBILITE DE DELETE LE CARNET
  end

  def exist?
    carnet = Carnets[:id => @id] if !@id.nil?
    carnet = Carnets[:uid_elv => @uid_elv] if !@uid_elv.nil? && @id.nil?
    carnet.nil? ? false : true
  end

  def get_onglets
    requires({:id => @id}, :id)
    onglets = []
    onglets_bdd = CarnetsOnglets.where(:carnets_id => @id)
    begin
      onglets_bdd.each do |o|
        onglet = Onglet.new(o.onglets_id)
        onglet.read
        onglets.push onglet          
      end      
    rescue Exception => e
      @logger.error MSG[LANG.to_sym][:error][:crud].sub("$1", "get_onglets").sub("$2", "Carnet").sub("$3", "récupération des onglets d'un carnet")
      raise MSG[LANG.to_sym][:error][:crud].sub("$1", "get_onglets").sub("$2", "Carnet").sub("$3", "récupération des onglets d'un carnet")
    end
    onglets
  end

  def get_entrees
    requires({:id => @id}, :id)
    entrees = []
    entrees_bdd = Saisies.where(:carnets_id => @id)
    begin
      entrees_bdd.each do |e|
        entree = Entree.new(e.id)
        entree.read
        entrees.push entree          
      end      
    rescue Exception => e
      @logger.error MSG[LANG.to_sym][:error][:crud].sub("$1", "get_entrees").sub("$2", "Carnet").sub("$3", "récupération des entrées d'un carnet")
      raise MSG[LANG.to_sym][:error][:crud].sub("$1", "get_entrees").sub("$2", "Carnet").sub("$3", "récupération des entrées d'un carnet")
    end
    entrees
  end

  def get_rights evignal
    requires({:id => @id}, :id)
    rights = []
    if evignal == -1
      rights_bdd = DroitsSpecifiques.where(:carnets_id => @id)
    else
      rights_bdd = DroitsSpecifiques.where(:carnets_id => @id, :evignal => evignal)
    end
    begin
      rights_bdd.each do |r|
        right = Right.new(r.id)
        right.select
        rights.push right          
      end   
    rescue Exception => e
      @logger.error MSG[LANG.to_sym][:error][:crud].sub("$1", "get_rights").sub("$2", "Carnet").sub("$3", "récupération des droits d'un carnet")
      raise MSG[LANG.to_sym][:error][:crud].sub("$1", "get_rights").sub("$2", "Carnet").sub("$3", "récupération des droits d'un carnet")
    end
    rights
  end

  def get_pers_evignal_or_hopital evignal=true, hopital=false
    requires({:id => @id}, :id)
    rights = []
    rights_bdd = DroitsSpecifiques.where(:carnets_id => @id, :hopital => hopital, :evignal => evignal)
    begin
      rights_bdd.each do |r|
        right = Right.new(r.id)
        right.select
        rights.push right          
      end   
    rescue Exception => e
      @logger.error MSG[LANG.to_sym][:error][:crud].sub("$1", "get_pers_hopital").sub("$2", "Carnet").sub("$3", "récupération du personnel à l'hopital")
      raise MSG[LANG.to_sym][:error][:crud].sub("$1", "get_pers_hopital").sub("$2", "Carnet").sub("$3", "récupération du personnel à l'hopital")
    end
    rights
  end
end