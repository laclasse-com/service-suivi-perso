module LaClasse
    module Helpers
        module User
            def user( uid = nil )
                JSON.parse( RestClient::Request.execute( method: :get,
                                                         url: "#{URL_ENT}/api/users/#{uid.nil? ? session['user'] : uid}",
                                                         user: ANNUAIRE[:app_id],
                                                         password: ANNUAIRE[:api_key] ) )
            end

            def user_is_admin?( uid = nil )
                LaClasse::User.admin?( user( uid ) )
            end

            def user_is_super_admin?( uid = nil )
                LaClasse::User.super_admin?( user( uid ) )
            end

            def user_needs_to_be( profile_types, uid = nil )
                LaClasse::User.is?( user( uid ), profile_types )
            end
        end
    end
end
