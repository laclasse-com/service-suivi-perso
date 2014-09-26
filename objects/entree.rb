#coding: utf-8
require 'logger'

class Entree

  include Outils

  attr_accessor :contenu, :date_modification

  attr_reader :id, :id_onglet, :id_carnet, :uid, :infos_owner, :avatar, :avatar_color, :back_color, :date_creation

  def initialize id=nil, id_onglet=nil, id_carnet=nil, uid=nil, avatar=AVATAR[:M], avatar_color="rgba(235,84,84,0.7)", back_color="rgba(232,194,84,0.3)", infos_owner="", contenu=""
    @id = id
    @id_onglet =id_onglet
    @id_carnet = id_carnet
    @uid = uid
    @avatar = avatar
    @avatar_color = avatar_color
    @back_color = back_color
    @infos_owner = infos_owner
    @contenu = contenu
    p Time.now.utc.inspect
    @date_modification = Time.now
    @date_creation = nil
    @logger = Logger.new(STDOUT)
  end

  def create 
    requires({:id_onglet => @id_onglet}, :id_onglet)
    requires({:id_carnet => @id_carnet}, :id_carnet)
    requires({:uid => @uid}, :uid)
    requires({:infos_owner => @infos_owner}, :infos_owner)
    requires({:infos_owner => @infos_owner}, :infos_owner, :empty)
    requires({:contenu => @contenu}, :contenu)
    begin
      @date_creation = Time.now.to_i
      new_input = Saisies.new
      new_input.uid = @uid
      new_input.carnets_id = @id_carnet
      new_input.avatar = @avatar
      new_input.avatar_color = @avatar_color
      new_input.back_color = @back_color
      new_input.infos_owner = @infos_owner
      new_input.contenu = @contenu
      new_input.date_creation = @date_creation
      new_input.date_modification = @date_modification
      new_input = new_input.save
      @id = new_input.id
      lie_onglet
    rescue Exception => e
      @logger.error MSG[LANG.to_sym][:error][:crud].sub("$1", "create").sub("$2", "Entree").sub("$3", "la création d'une entree")
      raise MSG[LANG.to_sym][:error][crud].sub("$1", "create").sub("$2", "Entree").sub("$3", "la création d'une entree")
    end
  end

  def lie_onglet
    requires({:id_entree => @id}, :id_entree)
    requires({:id_onglet => @id_onglet}, :id_onglet)
    begin
      new_liaison = EntreesOnglets.new
      new_liaison.saisies_id = @id
      new_liaison.onglets_id = @id_onglet
      new_liaison = new_liaison.save
      @id
    rescue Exception => e
      @logger.error MSG[LANG.to_sym][:error][:crud].sub("$1", "lie_carnet").sub("$2", "Entree").sub("$3", "lier une entree à un onglet")
      raise MSG[LANG.to_sym][:error][crud].sub("$1", "lie_carnet").sub("$2", "Entree").sub("$3", "lier une entree à un onglet")
    end
  end

  def read
    requires({:id => @id}, :id)
    entree = Saisies[:id => @id]
    requires({:entree => entree}, :entree)
    begin
      @id_onglet = EntreesOnglets[:saisies_id => @id].onglets_id if !EntreesOnglets[:saisies_id => @id].nil?
      @id_carnet = entree.carnets_id
      @uid = entree.uid
      @avatar = entree.avatar
      @avatar_color = entree.avatar_color
      @back_color = entree.back_color
      @infos_owner = entree.infos_owner
      @contenu = entree.contenu
      @date_creation = entree.date_creation
      @date_modification = entree.date_modification
    rescue Exception => e
      @logger.error MSG[LANG.to_sym][:error][:crud].sub("$1", "read").sub("$2", "Entree").sub("$3", "la récupération d'une entree")
      raise MSG[LANG.to_sym][:error][crud].sub("$1", "read").sub("$2", "Entree").sub("$3", "la récupération d'une entree")
    end
  end

  def update contenu=nil
    requires({:id => @id}, :id)
    entree = Saisies[:id => @id]
    requires({:entree => entree}, :entree)
    begin
      if !contenu.nil?
        entree.update(:contenu => contenu, :date_modification => Time.now)
        @contenu = contenu
        @date_modification = Time.now
      end
    rescue Exception => e
      @logger.error MSG[LANG.to_sym][:error][:crud].sub("$1", "update").sub("$2", "Entree").sub("$3", "la mise à jour d'une entrée")
      raise MSG[LANG.to_sym][:error][crud].sub("$1", "update").sub("$2", "Entree").sub("$3", "la mise à jour d'une entrée")
    end
  end

  def delete
    requires({:id_onglet => @id_onglet}, :id_onglet)
    requires({:id => @id}, :id)
    entree = Saisies[:id => @id]
    requires({:entree => entree}, :entree)
    begin
      delie_onglet
      entree.delete
    rescue Exception => e
      lie_onglet if EntreesOnglets[:saisies_id => @id, :onglets_id => @id_onglet].nil? && !Saisies[:id => @id].nil?
      create if Saisies[:id => @id].nil?
      @logger.error MSG[LANG.to_sym][:error][:crud].sub("$1", "delete").sub("$2", "Entree").sub("$3", "la suppression d'une entrée")
      raise MSG[LANG.to_sym][:error][crud].sub("$1", "delete").sub("$2", "Entree").sub("$3", "la suppression d'une entrée")
    end
  end

  def delie_onglet
    requires({:id => @id}, :id)
    begin
      EntreesOnglets.where(:saisies_id => @id).delete
    rescue Exception => e
      @logger.error MSG[LANG.to_sym][:error][:crud].sub("$1", "delie_carnet").sub("$2", "Entree").sub("$3", "delier une entrée à un onglet")
      raise MSG[LANG.to_sym][:error][crud].sub("$1", "delie_carnet").sub("$2", "Entree").sub("$3", "delier une entrée à un onglet")
    end
  end
end