require 'net/http'

require 'yaml'

module LaClasse
  module Helpers
    module User
      def user( uid = nil )
        JSON.parse( RestClient::Request.execute( method: :get,
                                                 url: "#{URL_ENT}/api/users/#{uid.nil? ? session['user'] : uid}",
                                                 user: ANNUAIRE[:app_id],
                                                 password: ANNUAIRE[:api_key] ) )
      end

      def user_active_profile( uid = nil )
        LaClasse::User.user_active_profile( user( uid ) )
      end

      def user_is_profile_in_structure?( profile_type, structure_id, uid = nil )
        LaClasse::User.user_is_profile_in_structure?( user( uid ) )
      end

      def user_is_admin?( uid = nil )
        LaClasse::User.user_is_admin?( user( uid ) )
      end

      def user_is_super_admin?( uid = nil )
        LaClasse::User.user_is_super_admin?( user( uid ) )
      end

      def user_needs_to_be( profile_types, uid = nil )
        active_structure = user_active_profile( uid )['structure_id']

        profile_types.reduce( false ) do |memo, profile_type|
          memo || user_is_profile_in_structure?( profile_type, active_structure, uid )
        end
      end

      def user_regroupements_ids( uid = nil )
        if %w[DIR ADM DOC CPE].include?( user_active_profile['type'] )
          JSON.parse( RestClient::Request.execute( method: :get,
                                                   url: "#{URL_ENT}/api/groups/?structure_id=#{user_active_profile['structure_id']}",
                                                   user: ANNUAIRE[:app_id],
                                                   password: ANNUAIRE[:api_key] ) )
              .map { |g| g['id'] }
        else
          user( uid )['groups'].map { |g| g['group_id'] }
        end
      end
    end
  end
end
