#coding: utf-8
require 'logger'

class Onglet

  include Outils

  attr_accessor :nom, :ordre

  attr_reader :id, :id_carnet, :uid_own, :date_creation

  def initialize id=nil, id_carnet=nil, nom=nil, uid_own=nil, ordre=1
    @id = id
    @id_carnet = id_carnet
    @nom = nom
    @uid_own = uid_own
    @date_creation = nil
    @ordre = ordre
    @logger = Logger.new(STDOUT)
  end

  def create
    requires({:nom => @nom}, :nom)
    requires({:uid_own => @uid_own}, :uid_own)
    begin
      @date_creation = Time.now.to_i
      new_tabs = Onglets.new
      new_tabs.nom = @nom
      new_tabs.uid_own = @uid_own
      new_tabs.date_creation = @date_creation
      new_tabs = new_tabs.save
      @id = new_tabs.id
      lie_carnet
    rescue Exception => e
      @logger.error MSG[LANG.to_sym][:error][:crud].sub("$1", "create").sub("$2", "Onglet").sub("$3", "la création d'un onglet")
      raise MSG[LANG.to_sym][:error][crud].sub("$1", "create").sub("$2", "Onglet").sub("$3", "la création d'un onglet")      
    end
  end

  def lie_carnet
    requires({:id_carnet => @id_carnet}, :id_carnet)
    requires({:id_onglet => @id}, :id_onglet)
    begin
      new_liaison = CarnetsOnglets.new
      new_liaison.carnets_id = @id_carnet
      new_liaison.onglets_id = @id
      new_liaison.ordre = @ordre
      new_liaison = new_liaison.save
      @id
    rescue Exception => e
      @logger.error MSG[LANG.to_sym][:error][:crud].sub("$1", "lie_carnet").sub("$2", "Onglet").sub("$3", "lier un carnet à un onglet")
      raise MSG[LANG.to_sym][:error][crud].sub("$1", "lie_carnet").sub("$2", "Onglet").sub("$3", "lier un carnet à un onglet")
    end
  end

  def read
    requires({:id => @id}, :id)
    onglet = Onglets[:id => @id]
    liaison = CarnetsOnglets[:onglets_id => @id]
    requires({:onglet => onglet}, :onglet)
    begin
      @id_carnet = liaison.carnets_id if !liaison.nil?
      @nom = onglet.nom
      @uid_own = onglet.uid_own
      @date_creation = onglet.date_creation
      @ordre = liaison.ordre if !liaison.nil?
    rescue Exception => e
      @logger.error MSG[LANG.to_sym][:error][:crud].sub("$1", "read").sub("$2", "Onglet").sub("$3", "la récupération d'un onglet")
      raise MSG[LANG.to_sym][:error][crud].sub("$1", "read").sub("$2", "Onglet").sub("$3", "la récupération d'un onglet")
    end 
  end

  def update nom=nil, ordre=nil
    requires({:id => @id}, :id)
    requires({:id_carnet => @id_carnet}, :id_carnet)
    onglet = Onglets[:id => @id]
    requires({:onglet => onglet}, :onglet)
    begin
      onglet.update(:nom => nom) if !nom.nil?
      CarnetsOnglets[:carnets_id => @id_carnet, :onglets_id => @id].update(:ordre => ordre) if !ordre.nil?
      @ordre = ordre if !ordre.nil?
      @nom = nom if !nom.nil?
    rescue Exception => e
      @logger.error MSG[LANG.to_sym][:error][:crud].sub("$1", "update").sub("$2", "Onglet").sub("$3", "la mise à jour d'un onglet")
      raise MSG[LANG.to_sym][:error][crud].sub("$1", "update").sub("$2", "Onglet").sub("$3", "la mise à jour d'un onglet")
    end
  end

  def delete
    requires({:id => @id}, :id)
    requires({:id_carnet => @id_carnet}, :id_carnet)
    onglet = Onglets[:id => @id]
    requires({:onglet => onglet}, :onglet)
    begin
      delie_carnet
      onglet.delete
    rescue Exception => e
      lie_carnet if CarnetsOnglets[:onglets_id => @id, :carnets_id => @id_carnet].nil? && !Onglets[:id => @id].nil?
      create if Onglets[:id => @id].nil?
      @logger.error MSG[LANG.to_sym][:error][:crud].sub("$1", "delete").sub("$2", "Onglet").sub("$3", "la suppression d'un onglet")
      raise MSG[LANG.to_sym][:error][crud].sub("$1", "delete").sub("$2", "Onglet").sub("$3", "la suppression d'un onglet")
    end
  end

  def delie_carnet
    requires({:id => @id}, :id)
    begin
      CarnetsOnglets.where(:onglets_id => @id).delete
    rescue Exception => e
      @logger.error MSG[LANG.to_sym][:error][:crud].sub("$1", "delie_carnet").sub("$2", "Onglet").sub("$3", "delier un carnet à un onglet")
      raise MSG[LANG.to_sym][:error][crud].sub("$1", "delie_carnet").sub("$2", "Onglet").sub("$3", "delier un carnet à un onglet")
    end
  end
  
  def get_entrees
    requires({:id => @id}, :id)
    entrees = []
    entrees_bdd = EntreesOnglets.where(:onglets_id => @id)
    begin
      entrees_bdd.each do |e|
        entree = Entree.new(e.saisies_id)
        entree.read
        if entree.id_carnet == @id_carnet && entree.id_onglet == @id
          entrees.push entree          
        end
      end      
    rescue Exception => e
      @logger.error MSG[LANG.to_sym][:error][:crud].sub("$1", "get_entrees").sub("$2", "Onglet").sub("$3", "récupération des entrées d'un onglet")
      raise MSG[LANG.to_sym][:error][crud].sub("$1", "get_entrees").sub("$2", "Onglet").sub("$3", "récupération des entrées d'un onglet")
    end
    p entrees.inspect
    entrees
  end
end