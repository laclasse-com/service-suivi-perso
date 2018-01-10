class Saisie < Sequel::Model(:saisies)
  many_to_many :onglets, class: :Onglet, join_table: :saisies_onglets
  one_to_many :ressources

  def before_destroy
    Ressource.where(saisie_id: id).destroy
  end

  def allow?( user, right )
    return true if right == :read

    return true if user['id'] == uid_author

    # if user can manage then she can edit onglet's pinned saisie(s)
    return true if pinned && onglets.reduce( true ) { |memo, onglet| memo && check_onglet( onglet.id, user, :manage ) }

    # by default etablissement's admins and super-admins have all rights
    LaClasse::User.admin?( user ) || LaClasse::User.super_admin?( user )
  end

  def to_json( arg )
    h = to_hash
    h[:date_creation] = DateTime.parse( h[:date_creation].to_s ) unless h[:date_creation].nil?
    h[:date_modification] = DateTime.parse( h[:date_modification].to_s ) unless h[:date_modification].nil?

    h.to_json( arg )
  end
end
