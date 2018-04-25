class Saisie < Sequel::Model(:saisies)
  many_to_many :onglets, class: :Onglet, join_table: :saisies_onglets
  one_to_many :ressources

  def before_destroy
    remove_all_onglets
    remove_all_ressources
  end

  def allow?( user, right )
    return true if right == :read

    return true if user['id'] == uid_author

    # if user can manage then she can edit onglet's saisie(s)
    return true if onglets.reduce( true ) do |memo, onglet|
      memo && Onglet[id: onglet.id].allow?( user, :manage )
    end

    # by default etablissement's admins and super-admins have all rights
    LaClasse::User.admin?( user ) || LaClasse::User.super_admin?( user )
  end

  def to_json( arg )
    h = to_hash
    h[:ctime] = DateTime.parse( h[:ctime].to_s ) unless h[:ctime].nil? # rubocop:disable Style/DateTime
    h[:mtime] = DateTime.parse( h[:mtime].to_s ) unless h[:mtime].nil? # rubocop:disable Style/DateTime

    h.to_json( arg )
  end
end
