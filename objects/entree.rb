# coding: utf-8
require 'logger'

# Classe de gestion des entrées dans le carnet.
class Entree
  include Outils

  attr_accessor :contenu, :date_modification, :avatar

  attr_reader :id, :id_onglet, :id_carnet, :uid, :infos_owner, :avatar_color, :back_color, :date_creation

  def initialize(id = nil, id_onglet = nil, id_carnet = nil, uid = nil, avatar = AVATAR[:M], avatar_color = 'rgba(235,84,84,0.7)', back_color = 'rgba(232,194,84,0.3)', infos_owner = '', contenu = '')
    @id = id
    @id_onglet = id_onglet
    @id_carnet = id_carnet
    @uid = uid
    @avatar = avatar
    @avatar_color = avatar_color
    @back_color = back_color
    @infos_owner = infos_owner
    @contenu = contenu
    @date_modification = Time.now
    @date_creation = nil
    @logger = Logger.new(STDOUT)
  end

  def create
    requires({id_onglet: @id_onglet}, :id_onglet)
    requires({id_carnet: @id_carnet}, :id_carnet)
    requires({uid: @uid}, :uid)
    requires({infos_owner: @infos_owner}, :infos_owner)
    requires({infos_owner: @infos_owner}, :infos_owner, :empty)
    requires({contenu: @contenu}, :contenu)
    begin
      @date_creation = Time.now
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
    rescue
      raise_error 'create', "la création d'une entree"
    end
  end

  def lie_onglet
    requires({id_entree: @id}, :id_entree)
    requires({id_onglet: @id_onglet}, :id_onglet)
    begin
      new_liaison = EntreesOnglets.new
      new_liaison.saisies_id = @id
      new_liaison.onglets_id = @id_onglet
      new_liaison.save
      @id
    rescue
      raise_error 'lie_carnet', 'lier une entree à un onglet'
    end
  end

  def read
    requires({id: @id}, :id)
    entree = Saisies[id: @id]
    requires({entree: entree}, :entree)
    begin
      @id_onglet = EntreesOnglets[saisies_id: @id].onglets_id unless EntreesOnglets[saisies_id: @id].nil?
      @id_carnet = entree.carnets_id
      @uid = entree.uid
      @avatar = entree.avatar
      @avatar_color = entree.avatar_color
      @back_color = entree.back_color
      @infos_owner = entree.infos_owner
      @contenu = entree.contenu
      @date_creation = entree.date_creation
      @date_modification = entree.date_modification
    rescue
      raise_error 'read', "la récupération d'une entrée"
    end
  end

  def update(contenu = nil, avatar = nil)
    requires({id: @id}, :id)
    entree = Saisies[id: @id]
    requires({entree: entree}, :entree)
    begin
      unless contenu.nil?
        entree.update(contenu: contenu, date_modification: Time.now)
        @contenu = contenu
      end
      unless avatar.nil?
        entree.update(avatar: avatar, date_modification: Time.now)
        @avatar = avatar
      end
      @date_modification = Time.now if !avatar.nil? || !contenu.nil?
    rescue
      raise_error 'update', "la mise à jour d'une entrée"
    end
  end

  def delete
    requires({id_onglet: @id_onglet}, :id_onglet)
    requires({id: @id}, :id)
    entree = Saisies[id: @id]
    requires({entree: entree}, :entree)
    begin
      delie_onglet
      delete_docs
      entree.delete
    rescue
      lie_onglet if EntreesOnglets[saisies_id: @id, onglets_id: @id_onglet].nil? && !Saisies[id: @id].nil?
      create if Saisies[id: @id].nil?
      raise_error 'delete', "la suppression d'une entrée"
    end
  end

  def delie_onglet
    requires({id: @id}, :id)
    begin
      EntreesOnglets.where(saisies_id: @id).delete
    rescue
      raise_error 'delie_carnet', 'délier une entrée à un onglet'
    end
  end

  # met à jour l'avatar de toute les entrée d'un utilisateur
  def update_avatar(avatar)
    requires({uid: @uid}, :uid)
    requires({avatar: avatar}, :avatar)
    begin
      Saisies.where(uid: @uid).each do |entree|
        entree.update(avatar: avatar)
      end
    rescue
      raise_error 'update_avatar', "mise à jour de tous de l'avatar"
    end
  end

  def delete_docs
    requires({id: @id}, :id)
    begin
      Docs.where(saisies_id: @id).delete
    rescue
      raise_error 'delete_docs', "supprime les documents d'une entrée"
    end
  end

  def docs_attaches
    requires({id: @id}, :id)
    docs = []
    begin
      Docs.where(saisies_id: @id).each do |d|
        doc = Doc.new d.id
        doc.read
        docs.push(id: doc.id, nom: doc.nom, md5: doc.url)
      end
    rescue
      raise_error 'docs_attaches', "récupération des documents d'une entrée"
    end
    docs
  end

  def raise_error(function_name, action_msg)
    crud_error = CrudError.new
    @logger.error MSG[LANG.to_sym][:error][:crud].sub('$1', function_name).sub('$2', 'Entree').sub('$3', action_msg)
    fail crud_error,  MSG[LANG.to_sym][:error][:crud].sub('$1', function_name).sub('$2', 'Entree').sub('$3', action_msg)
  end
end
