# coding: utf-8

class Onglet < Sequel::Model(:onglets)
  many_to_one :carnets, class: :Carnet, key: :carnet_id
  one_to_many :saisies, class: :Saisie
  one_to_many :droits
  one_to_many :ressources

  def before_destroy
    Droit.where(onglet_id: id).destroy
    Saisie.where(onglet_id: id).destroy
    Ressource.where(onglet_id: id).destroy
  end

  def init_droits( default_rights, user_creator )
    add_droit( uid: user_creator['id'], profil_id: nil, sharable_id: nil, read: true, write: true, manage: true )
    return if carnets.uid_eleve == user_creator['id']
    add_droit( uid: carnets.uid_eleve, profil_id: nil, sharable_id: nil, read: true, write: true, manage: false )
    default_rights.each do |default_right|
      add_droit( default_right )
    end
  end

  def allow?( user, right )
    droit = droits_dataset[uid: user['id']]
    return droit[ right ] unless droit.nil?

    droit = droits_dataset[profil_id: LaClasse::User.user_active_profile( user )['type']]
    return droit[ right ] unless droit.nil?

    droits_dataset.count > 1 && ( LaClasse::User.user_is_admin?( user ) || LaClasse::User.user_is_super_admin?( user ) )
  end

  def to_json( arg )
    h = to_hash
    h[:date_creation] = DateTime.parse( h[:date_creation].to_s ) unless h[:date_creation].nil?

    h.to_json( arg )
  end
end
