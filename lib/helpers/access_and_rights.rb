module Suivi
  module Helpers
    module AccessAndRights
      def get_and_check_onglet( id, user, right )
        onglet = Onglet[id: id]
        halt( 404, '404 Unknown onglet' ) if onglet.nil?
        halt( 403, '403 Forbidden' ) unless onglet.allow?( user, right )

        onglet
      end

      def get_and_check_student_s_onglets( uid_student, user, right )
        Onglet.where(uid_student: uid_student)
              .all
              .select { |onglet| onglet.allow?( user, right ) }
      end

      def get_and_check_saisie( id, user, right )
        saisie = Saisie[id: id]
        halt( 404, '404 Unknown saisie' ) if saisie.nil?
        halt( 403, '403 Forbidden' ) unless saisie.allow?( user, right )

        saisie
      end
    end
  end
end
