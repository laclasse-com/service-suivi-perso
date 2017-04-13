# coding: utf-8

class Saisie < Sequel::Model(:saisies)
  plugin :validation_helpers
  plugin :json_serializer
  plugin :composition

  many_to_one :onglets, class: :Onglet, key: :onglet_id
  one_to_many :droits
  one_to_many :ressources

  def before_destroy
    Droit.where(saisie_id: id).destroy
  end

  def init_droits( default_rights, user_creator )
    default_rights.each do |default_right|
      add_droit( default_right )
    end
    add_droit( uid: user_creator[:uid], profil_id: nil, sharable_id: nil, read: true, write: true )
  end

  def allow?( user, right )
    droit = droits_dataset[uid: user[:uid]]
    return droit[ right ] unless droit.nil?

    droit = droits_dataset[profil_id: user[:user_detailed]['profil_actif']['profil_id']]
    return droit[ right ] if !droit.nil? && droit.key?( right )

    is_admin = user[:user_detailed]['roles'].count do |role|
      role['etablissement_code_uai'] == user[:user_detailed]['profil_actif']['etablissement_code_uai'] &&
        ( role['role_id'] == 'TECH' ||
          role['role_id'].match('ADM.*') )
    end > 0

    is_super_admin = user[:user_detailed]['roles'].count { |role| role['role_id'] == 'TECH' } > 0

    # by default etablissement's admins and super-admins have all rights
    is_admin || is_super_admin
  end
end
