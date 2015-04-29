# coding: utf-8

# Module de fonctions sur les roles.
module RolesHelpers
  # trouver le role maximum sur l'étab actif
  def affecter_role_max(personnels)
    personnels.each do |personnel|
      role_id = ''
      personnel['roles'].each do |role|
        if COEFF[role['role_id']] > COEFF[role_id] && role['role_id'] != ROLES[:super_admin]
          role_id = role['role_id']
        end
      end
      personnel['role_id'] = role_id
    end
    personnels
  end
end
