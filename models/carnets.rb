# coding: utf-8

class Carnet < Sequel::Model(:carnets)
  plugin :validation_helpers
  plugin :json_serializer
  plugin :composition

  one_to_many :onglets
  one_to_many :droits

  def self.of( uid_eleve )
    carnet = Carnet[ uid_elv: uid_eleve ]
    if carnet.nil?
      # FIXME: check that uid_eleve is actually an eleve
      carnet = Carnet.create( uid_elv: uid_eleve,
                              sharable_id: nil,
                              date_creation: DateTime.now )

      carnet.init_droits( DEFAULT_RIGHTS[ :Carnet ] )
    end

    carnet
  end

  def before_destroy
    Droit.where(onglet_id: id).destroy
    Onglet.where(onglet_id: id).destroy
  end

  def init_droits( default_rights )
    default_rights.each do |default_right|
      add_droit( default_right )
    end
    add_droit( uid: uid_elv, read: true, write: true )
  end

  def allow?( user, right )
    droit = droits_dataset[uid: user[:uid]]
    return droit[ right ] unless droit.nil?

    droit = droits_dataset[profil_id: user[:user_detailed]['profil_actif']['profil_id']]
    return droit[ right ] unless droit.nil?

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
