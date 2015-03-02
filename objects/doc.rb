#coding: utf-8
require 'logger'

class Doc

  include Outils

  attr_accessor :nom, :url

  attr_reader :id, :saisies_id

  def initialize id=nil, nom=nil, url=nil, saisies_id=nil
    @id = id
    @nom = nom
    @url = url
    @saisies_id = saisies_id
    @logger = Logger.new(STDOUT)
  end

  def create
    requires({:nom => @nom}, :nom)
    requires({:url => @url}, :url)
    requires({:saisies_id => @saisies_id}, :saisies_id)
    begin
      new_doc = Docs.new
      new_doc.nom = @nom
      new_doc.url = @url
      new_doc.saisies_id = @saisies_id
      new_doc = new_doc.save
      @id = new_doc.id
    rescue Exception => e
      @logger.error e.message+ " "+e.class.to_s
      @logger.error MSG[LANG.to_sym][:error][:crud].sub("$1", "create").sub("$2", "Doc").sub("$3", "la création d'un document")
      raise MSG[LANG.to_sym][:error][:crud].sub("$1", "create").sub("$2", "Doc").sub("$3", "la création d'un document")
    end
  end

  def read
    doc = Docs[:id => @id] if !@id.nil?
    doc = Docs[:url => @url] if !@url.nil? && @id.nil?
    requires({:doc => doc}, :doc)
    begin
      @id = doc.id
      @nom = doc.nom
      @url = doc.url
      @saisies_id = doc.saisies_id
    rescue 
      @logger.error MSG[LANG.to_sym][:error][:crud].sub("$1", "read").sub("$2", "Doc").sub("$3", "la récupération du document")
      raise MSG[LANG.to_sym][:error][:crud].sub("$1", "read").sub("$2", "Doc").sub("$3", "la récupération du document")
    end
  end

  def update nom=nil, url=nil
    doc = Docs[:id => @id] if !@id.nil?
    doc = Docs[:url => @url] if !@url.nil? && @id.nil?
    requires({:doc => doc}, :doc)
    begin
      doc.update(:nom => nom) if !nom.nil?
      @nom = nom if !nom.nil?
      doc.update(:url => url) if !url.nil?
      @url = url if !url.nil?
    rescue Exception => e
      @logger.error MSG[LANG.to_sym][:error][:crud].sub("$1", "update").sub("$2", "Doc").sub("$3", "la mise à jour")
      raise MSG[LANG.to_sym][:error][:crud].sub("$1", "update").sub("$2", "Doc").sub("$3", "la mise à jour")
    end
  end

  def delete
    doc = Docs[:id => @id] if !@id.nil?
    doc = Docs[:url => @url] if !@url.nil? && @id.nil?
    requires({:doc => doc}, :doc)
    begin
      doc.delete
    rescue Exception => e
      @logger.error MSG[LANG.to_sym][:error][:crud].sub("$1", "delete").sub("$2", "Doc").sub("$3", "la suppression du document")
      raise MSG[LANG.to_sym][:error][:crud].sub("$1", "delete").sub("$2", "Doc").sub("$3", "la suppression du document")
    end
  end
end