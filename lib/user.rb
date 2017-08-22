module LaClasse
  module User
    module_function

    def user_active_profile( user )
      user['profiles'].select { |profile| profile['active'] }.first
    end

    def user_is_profile_in_structure?( profile_type, structure_id, user )
      !user['profiles'].select { |profile| profile_type == profile['type'] && structure_id == profile['structure_id'] }.empty?
    end

    def user_is_admin?( user )
      user_is_profile_in_structure?( 'ADM', user_active_profile( user )['structure_id'], user )
    end

    def user_is_super_admin?( user )
      !user['profiles'].select { |profile| 'TECH' == profile['type'] }.empty?
    end
  end
end
