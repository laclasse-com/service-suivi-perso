# coding: utf-8
require 'logger'

# Classe de gestion des entrées dans le carnet.
class Entree
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
    @date_creation = Time.now
    new_input = Saisie.new
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
  end

  def lie_onglet
    new_liaison = EntreesOnglet.new
    new_liaison.saisies_id = @id
    new_liaison.onglets_id = @id_onglet
    new_liaison.save
    @id
  end

  def read
    entree = Saisie[id: @id]

    @id_onglet = EntreesOnglet[saisies_id: @id].onglets_id unless EntreesOnglet[saisies_id: @id].nil?
    @id_carnet = entree.carnets_id
    @uid = entree.uid
    @avatar = entree.avatar
    @avatar_color = entree.avatar_color
    @back_color = entree.back_color
    @infos_owner = entree.infos_owner
    @contenu = entree.contenu
    @date_creation = entree.date_creation
    @date_modification = entree.date_modification
  end

  def update(contenu = nil, avatar = nil)
    entree = Saisie[id: @id]


    unless contenu.nil?
      entree.update(contenu: contenu, date_modification: Time.now)
      @contenu = contenu
    end
    unless avatar.nil?
      entree.update(avatar: avatar, date_modification: Time.now)
      @avatar = avatar
    end
    @date_modification = Time.now if !avatar.nil? || !contenu.nil?
  end

  def delete
    entree = Saisie[id: @id]

    delie_onglet
    delete_docs
    entree.delete
  rescue
    lie_onglet if EntreesOnglet[saisies_id: @id, onglets_id: @id_onglet].nil? && !Saisie[id: @id].nil?
    create if Saisie[id: @id].nil?
  end

  def delie_onglet
    EntreesOnglet.where(saisies_id: @id).delete
  end

  # met à jour l'avatar de toute les entrée d'un utilisateur
  def update_avatar(avatar)
    Saisie.where(uid: @uid).each do |entree|
      entree.update(avatar: avatar)
    end
  end

  def delete_docs
    Ressource.where(saisies_id: @id).delete
  end

  def docs_attaches
    docs = []

    Ressource.where(saisies_id: @id).each do |d|
      doc = Doc.new d.id
      doc.read
      docs.push(id: doc.id, nom: doc.nom, md5: doc.url)
    end
    docs
  end
end
