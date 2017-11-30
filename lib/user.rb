module LaClasse
  module User
    module_function

    def groups( user )
      user['groups']
    end

    def active_profile( user )
      user['profiles'].select { |profile| profile['active'] }.first
    end

    def profile_in_structure?( profile_type, structure_id, user )
      !user['profiles'].select { |profile| profile_type == profile['type'] && structure_id == profile['structure_id'] }.empty?
    end

    def admin?( user )
      profile_in_structure?( 'ADM', active_profile( user )['structure_id'], user )
    end

    def super_admin?( user )
      !user['profiles'].select { |profile| profile['type'] == 'TECH' }.empty?
    end
  end
end
