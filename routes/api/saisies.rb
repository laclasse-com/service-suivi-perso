# -*- coding: utf-8 -*-

module Suivi
  module Routes
    module Api
      module Saisies
        def self.registered( app )
          app.get "#{APP_PATH}/api/carnets/:uid_eleve/onglets/:onglet_id/saisies" do
            param :uid_eleve, String, required: true # unused
            param :onglet_id, Integer, required: true

            onglet = Onglet[id: params[:onglet_id]]
            error!( '404 Unknown onglet', 404 ) if onglet.nil?
            error!( '403 Forbidden', 403 ) unless onglet.allow?( user, :read )

            onglet.saisies_dataset.naked.all
          end

          app.post "#{APP_PATH}/api/carnets/:uid_eleve/onglets/:onglet_id/saisies" do
            param :uid_eleve, String, required: true # unused
            param :onglet_id, Integer, required: true
            param :contenu, String, required: true
            param :background_color, String, required: true

            onglet = Onglet[id: params[:onglet_id]]
            error!( '404 Unknown onglet', 404 ) if onglet.nil?
            error!( '403 Forbidden', 403 ) unless onglet.allow?( user, :write )

            onglet.add_saisy( uid: user[:uid],
                              date_creation: DateTime.now,
                              contenu: params[:contenu],
                              back_color: params[:background_color] )
          end

          app.put "#{APP_PATH}/api/carnets/:uid_eleve/onglets/:onglet_id/saisies/:id" do
            param :uid_eleve, String, required: true # unused
            param :onglet_id, Integer, required: true
            param :id, Integer, required: true
            param :contenu, String, required: false
            param :background_color, String, required: false

            onglet = Onglet[id: params[:onglet_id]]
            error!( '404 Unknown onglet', 404 ) if onglet.nil?
            error!( '403 Forbidden', 403 ) unless onglet.allow?( user, :write )

            saisie = Saisie[id: params[:id]]
            error!( '404 Unknown saisie', 404 ) if saisie.nil?

            changed = false
            if params.key?(:contenu)
              saisie.contenu = params[:contenu]
              changed = true
            end
            if params.key?(:background_color)
              saisie.back_color = params[:background_color]
              changed = true
            end

            if changed
              saisie.date_modification = DateTime.now
              saisie.save
            end

            saisie
          end

          app.delete "#{APP_PATH}/api/carnets/:uid_eleve/onglets/:onglet_id/saisies/:id" do
            param :uid_eleve, String, required: true # unused
            param :onglet_id, Integer, required: true
            param :id, Integer, required: true

            onglet = Onglet[id: params[:onglet_id]]
            error!( '404 Unknown onglet', 404 ) if onglet.nil?
            error!( '403 Forbidden', 403 ) unless onglet.allow?( user, :write )

            saisie = Saisie[id: params[:id]]
            error!( '404 Unknown saisie', 404 ) if saisie.nil?

            onglet.remove_saisy( saisie )
          end
        end
      end
    end
  end
end
