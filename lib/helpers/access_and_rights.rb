# coding: utf-8
module Suivi
  module Helpers
    module AccessAndRights
      # trouver le role maximum sur l'étab actif
      def get_and_check_carnet( uid_eleve, right )
        carnet = Carnet.of( uid_eleve )
        error!( '404 Unknown carnet', 404 ) if carnet.nil?
        error!( '403 Forbidden', 403 ) unless carnet.allow?( user, right )

        carnet
      end

      def get_and_check_onglet( id, right )
        onglet = Onglet[id: id]
        error!( '404 Unknown onglet', 404 ) if onglet.nil?
        error!( '403 Forbidden', 403 ) unless onglet.allow?( user, right )

        onglet
      end

      def get_and_check_saisie( id )
        saisie = Saisie[id: params[:id]]
        error!( '404 Unknown saisie', 404 ) if saisie.nil?

        saisie
      end
    end
  end
end
