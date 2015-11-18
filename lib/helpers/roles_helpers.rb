# coding: utf-8

# Module de fonctions sur les roles.
module RolesHelpers
  # trouver le role maximum sur l'étab actif
  def affecter_role_max(personnels)
    personnels.each do |personnel|
      unless personnel['roles'].nil?
        personnel['role_id'] = personnel['roles'].reduce( '' ) do |memo, role|
          role['role_id'] if role['role_id'] != ROLES[:super_admin] && COEFF[ role['role_id'] ] > COEFF[ memo ]
        end
      end
    end
  end
end
