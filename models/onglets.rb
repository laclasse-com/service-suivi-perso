class Onglet < Sequel::Model(:onglets)
  many_to_one :carnets, class: :Carnet, key: :carnet_id
  many_to_many :saisies, class: :Saisie, join_table: :saisies_onglets, left_key: :onglet_id, right_key: :saisie_id
  one_to_many :droits
  one_to_many :ressources

  def before_destroy
    Droit.where(onglet_id: id).destroy
    saisies = remove_all_saisies
    saisies.each(&:destroy) unless saisies.nil?
    Ressource.where(onglet_id: id).destroy
  end

  def init_droits( user_creator )
    add_droit( uid: user_creator['id'], profil_id: nil, sharable_id: nil, read: true, write: true, manage: true )
    add_droit( uid: carnets.uid_eleve, profil_id: nil, sharable_id: nil, read: true, write: true, manage: false ) unless carnets.uid_eleve == user_creator['id']
  end

  def allow?( user, right )
    droit = droits_dataset[uid: user['id']]
    return droit[right] unless droit.nil?

    droit = droits_dataset[profil_id: LaClasse::User.active_profile( user )['type']]
    return droit[right] unless droit.nil?

    droit = droits_dataset[group_id: LaClasse::User.groups( user ).map { |group| group['group_id'] } ]
    return droit[right] unless droit.nil?

    droits_dataset.count > 1 && ( LaClasse::User.admin?( user ) || LaClasse::User.super_admin?( user ) )
  end

  def to_json( arg )
    h = to_hash
    h[:date_creation] = Date.parse( h[:date_creation].to_s ) unless h[:date_creation].nil?

    h.to_json( arg )
  end
end
