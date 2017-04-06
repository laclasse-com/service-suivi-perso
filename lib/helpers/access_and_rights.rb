# coding: utf-8
module Suivi
  module Helpers
    module AccessAndRights
      # trouver le role maximum sur l'étab actif
      def get_and_check_carnet( uid_eleve, user, right )
        carnet = Carnet.of( uid_eleve )
        halt( 404, '404 Unknown carnet' ) if carnet.nil?
        halt( 403, '403 Forbidden' ) unless carnet.allow?( user, right )

        carnet
      end

      def get_and_check_onglet( id, user, right )
        onglet = Onglet[id: id]
        halt( 404, '404 Unknown onglet' ) if onglet.nil?
        halt( 403, '403 Forbidden' ) unless onglet.allow?( user, right )

        onglet
      end

      def get_and_check_saisie( id, user, right )
        saisie = Saisie[id: params[:id]]
        halt( 404, '404 Unknown saisie' ) if saisie.nil?
        halt( 403, '403 Forbidden' ) unless saisie.allow?( user, right )

        saisie
      end
    end
  end
end
