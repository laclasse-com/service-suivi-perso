# coding: utf-8
require 'logger'

# Classe de gestion des documents attachés sur les posts de carnets
class Doc
  include Outils

  attr_accessor :nom, :url

  attr_reader :id, :saisies_id

  def initialize(id = nil, nom = nil, url = nil, saisies_id = nil)
    @id = id
    @nom = nom
    @url = url
    @saisies_id = saisies_id
    @logger = Logger.new(STDOUT)
    # For CRUD <> create.
    @doc = Docs[id: @id] unless @id.nil?
    @doc = Docs[url: @url] if !@url.nil? && @id.nil?
  end

  def create
    requires({nom: @nom}, :nom)
    requires({url: @url}, :url)
    requires({saisies_id: @saisies_id}, :saisies_id)
    begin
      new_doc = Docs.new
      new_doc.nom = @nom
      new_doc.url = @url
      new_doc.saisies_id = @saisies_id
      new_doc = new_doc.save
      @id = new_doc.id
    rescue
      raise_error 'create', "la création d'un document"
    end
  end

  def read
    requires({doc: @doc}, :doc)
    begin
      @id = @doc.id
      @nom = @doc.nom
      @url = @doc.url
      @saisies_id = @doc.saisies_id
    rescue
      raise_error 'read', 'la récupération du document'
    end
  end

  def update(nom = nil, url = nil)
    requires({doc: @doc}, :doc)
    begin
      @doc.update(nom: nom) unless nom.nil?
      @nom = nom unless nom.nil?
      @doc.update(url: url) unless url.nil?
      @url = url unless url.nil?
    rescue
      raise_error 'update', 'la mise à jour'
    end
  end

  def delete
    requires({doc: @doc}, :doc)
    begin
      @doc.delete
    rescue
      raise_error 'update', 'la suppression du document'
    end
  end

  def raise_error(function_name, action_msg)
    crud_error = CrudError.new
    @logger.error MSG[LANG.to_sym][:error][:crud].sub('$1', function_name).sub('$2', 'Doc').sub('$3', action_msg)
    fail crud_error,  MSG[LANG.to_sym][:error][:crud].sub('$1', function_name).sub('$2', 'Doc').sub('$3', action_msg)
  end
end
