# coding: utf-8

class Saisie < Sequel::Model(:saisies)
  many_to_one :onglets, class: :Onglet, key: :onglet_id
  one_to_many :ressources

  def before_destroy
    Ressource.where(saisie_id: id).destroy
  end

  def allow?( user, right )
    return true if right == :read

    return true if user['id'] == uid_author

    # if user can manage then she can edit onglet's pinned saisie(s)
    return true if pinned && Onglet[ onglet_id ].allow?( user, :manage )

    # by default etablissement's admins and super-admins have all rights
    LaClasse::User.user_is_admin?( user ) || LaClasse::User.user_is_super_admin?( user )
  end

  def to_json( arg )
    h = to_hash
    h[:date_creation] = DateTime.parse( h[:date_creation].to_s ) unless h[:date_creation].nil?
    h[:date_modification] = DateTime.parse( h[:date_modification].to_s ) unless h[:date_modification].nil?

    h.to_json( arg )
  end
end
