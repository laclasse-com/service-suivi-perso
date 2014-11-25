#coding: utf-8
require 'logger'

class Right

  include Outils

  attr_accessor :read, :write, :admin, :hopital, :evignal

  attr_reader :id, :uid, :full_name, :profil, :carnet_id, :date_creation

  def initialize id=nil, uid=nil, full_name="", profil="", carnet_id=nil, read=0, write=0, admin=0, hopital=0, evignal=0
    @id = id
    @uid = uid
    @full_name = full_name
    @profil = profil
    @carnet_id = carnet_id
    @read = read
    @write = write
    @admin = admin
    @hopital = hopital
    @evignal = evignal
    @date_creation = nil
    @logger = Logger.new(STDOUT)
  end

  def create
    requires({:uid => @uid}, :uid)
    requires({:carnet_id => @carnet_id}, :carnet_id)
    begin
      @date_creation = Time.now
      new_right = DroitsSpecifiques.new
      new_right.uid = @uid
      new_right.full_name = @full_name
      new_right.profil = @profil
      new_right.carnets_id = @carnet_id
      new_right.read = @read
      new_right.write = @write
      new_right.admin = @admin
      new_right.hopital = @hopital
      new_right.evignal = @evignal
      new_right.date_creation = @date_creation
      new_right = new_right.save
      @id = new_right.id
    rescue Exception => e
      @logger.error MSG[LANG.to_sym][:error][:crud].sub("$1", "create").sub("$2", "Right").sub("$3", "la création d'un droit")
      raise MSG[LANG.to_sym][:error][crud].sub("$1", "create").sub("$2", "Right").sub("$3", "la création d'un droit")
    end
  end

  def select
    right = DroitsSpecifiques[:id => @id] if !@id.nil?
    right = DroitsSpecifiques[:uid => @uid, :carnets_id => @carnet_id] if !@uid.nil? && !@carnet_id.nil? && right.nil?
    requires({:right => right}, :right)
    begin
      @id = right.id
      @uid = right.uid
      @full_name = right.full_name
      @profil = right.profil
      @carnet_id = right.carnets_id
      @read = right.read
      @write = right.write
      @admin = right.admin
      @hopital = right.hopital
      @evignal = right.evignal
      @date_creation = right.date_creation
    rescue Exception => e
      @logger.error MSG[LANG.to_sym][:error][:crud].sub("$1", "select").sub("$2", "Right").sub("$3", "la récupération d'un droit")
      raise MSG[LANG.to_sym][:error][crud].sub("$1", "select").sub("$2", "Right").sub("$3", "la récupération d'un droit")
    end
  end

  def update read=nil, write=nil, admin=nil, hopital=nil, evignal=nil
   right = DroitsSpecifiques[:id => @id] if !@id.nil?
    right = DroitsSpecifiques[:uid => @uid, :carnets_id => @carnet_id] if !@uid.nil? && !@carnet_id.nil? && right.nil?
    requires({:right => right}, :right)
    begin
      right.update(:read => read) if !read.nil?
      right.update(:write => write) if !write.nil?
      right.update(:admin => admin) if !admin.nil?
      right.update(:hopital => hopital) if !hopital.nil?
      right.update(:evignal => evignal) if !evignal.nil?
      @read = read if !read.nil?
      @write = write if !write.nil?
      @admin = admin if !admin.nil?
      @hopital = hopital if !hopital.nil?
      @evignal = evignal if !evignal.nil?
    rescue Exception => e
      @logger.error MSG[LANG.to_sym][:error][:crud].sub("$1", "update").sub("$2", "Right").sub("$3", "la mise à jour d'un droit")
      raise MSG[LANG.to_sym][:error][crud].sub("$1", "update").sub("$2", "Right").sub("$3", "la mise à jour d'un droit")
    end
  end

  def delete
    right = DroitsSpecifiques[:id => @id] if !@id.nil?
    right = DroitsSpecifiques[:uid => @uid, :carnets_id => @carnet_id] if !@uid.nil? && !@carnet_id.nil? && right.nil?
    requires({:right => right}, :right)
    begin
      right.delete
    rescue Exception => e
      @logger.error MSG[LANG.to_sym][:error][:crud].sub("$1", "update").sub("$2", "Right").sub("$3", "la suppression d'un droit")
      raise MSG[LANG.to_sym][:error][crud].sub("$1", "update").sub("$2", "Right").sub("$3", "la suppression d'un droit")
    end
  end
end