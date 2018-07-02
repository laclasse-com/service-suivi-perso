class Onglet < Sequel::Model(:onglets)
  many_to_many :saisies, class: :Saisie, join_table: :saisies_onglets, left_key: :onglet_id, right_key: :saisie_id
  one_to_many :rights
  one_to_many :ressources

  def before_destroy
    Right.where(onglet_id: id).destroy
    saisies = remove_all_saisies
    saisies.each(&:destroy) unless saisies.nil?
    Ressource.where(onglet_id: id).destroy
  end

  def init_rights( user_creator )
    add_right( uid: user_creator['id'], profile_type: nil, sharable_id: nil, read: true, write: true, manage: true )
    add_right( uid: uid_student, profile_type: nil, sharable_id: nil, read: true, write: true, manage: false ) unless uid_student == user_creator['id']
  end

  def allow?( user, asked_right )
    right = rights_dataset[uid: user['id']]
    return right[asked_right] unless right.nil?

    rights = rights_dataset.where( profile_type: user['profiles'].map { |d| d['type'] } ).all
    return rights.reduce( true ) { |memo, d| memo && d[asked_right] } unless rights.empty?

    rights = rights_dataset.where( group_id: user['groups'].map { |group| group['group_id'] } ).all
    return rights.reduce( true ) { |memo, d| memo && d[asked_right] } unless rights.empty?

    rights_dataset.count > 1 && ( LaClasse::User.admin?( user ) || LaClasse::User.super_admin?( user ) )
  end

  def to_json( arg )
    h = to_hash
    h[:ctime] = Date.parse( h[:ctime].to_s ) unless h[:ctime].nil?

    h.to_json( arg )
  end
end
