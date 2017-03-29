# coding: utf-8
require 'logger'

# Classe de gestion des droits sur le carnets et ses onglets
class Right
  attr_accessor :read, :write, :admin, :hopital, :evignal

  attr_reader :id, :uid, :full_name, :profil, :carnet_id, :date_creation

  def initialize(id = nil, uid = nil, full_name = '', profil = '', carnet_id = nil, read = 0, write = 0, admin = 0, hopital = 0, evignal = 0)
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
    @date_creation = Time.now
    new_right = Droit.new
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
  end

  def right_select
    right = Droit[id: @id] unless @id.nil?
    right = Droit[uid: @uid, carnets_id: @carnet_id] if !@uid.nil? && !@carnet_id.nil? && right.nil?
    right
  end

  def select
    right = right_select

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
  end

  def update(read = nil, write = nil, admin = nil, hopital = nil, evignal = nil)
    right = right_select

    right.update(read: read) unless read.nil?
    right.update(write: write) unless write.nil?
    right.update(admin: admin) unless admin.nil?
    right.update(hopital: hopital) unless hopital.nil?
    right.update(evignal: evignal) unless evignal.nil?
    @read = read unless read.nil?
    @write = write unless write.nil?
    @admin = admin unless admin.nil?
    @hopital = hopital unless hopital.nil?
    @evignal = evignal unless evignal.nil?
  end

  def delete
    right = right_select

    right.delete
  end

  def exist?
    right = right_select
    right.nil? ? false : true
  end
end
