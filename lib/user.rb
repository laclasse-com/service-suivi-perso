# frozen_string_literal: true

module LaClasse
    module User
        module_function

        def is?( user, profile_types )
            !user['profiles'].select { |profile| profile_types.include?( profile['type'] ) }.empty?
        end

        def admin?( user )
            is?( user, ['ADM'] )
        end

        def super_admin?( user )
            is?( user, ['TECH'] )
        end
    end
end
