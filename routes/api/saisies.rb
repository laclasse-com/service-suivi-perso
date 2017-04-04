# -*- coding: utf-8 -*-

module Suivi
  module Routes
    module Api
      module Saisies
        def self.registered( app )
          app.get "#{APP_PATH}/api/carnets/:uid_eleve/onglets/:onglet_id/saisies/?" do
            param :uid_eleve, String, required: true
            param :onglet_id, Integer, required: true

            get_and_check_carnet( params['uid_eleve'], user, :write )
            onglet = get_and_check_onglet( params['onglet_id'], user, :write )

            json onglet.saisies_dataset.naked.all
          end

          app.get "#{APP_PATH}/api/carnets/:uid_eleve/onglets/:onglet_id/saisies/:id" do
            param :uid_eleve, String, required: true
            param :onglet_id, Integer, required: true
            param :id, Integer, required: true

            get_and_check_carnet( params['uid_eleve'], user, :write )
            get_and_check_onglet( params['onglet_id'], user, :write )

            json get_and_check_saisie( params['id'] )
          end

          app.post "#{APP_PATH}/api/carnets/:uid_eleve/onglets/:onglet_id/saisies/?" do
            param :uid_eleve, String, required: true
            param :onglet_id, Integer, required: true
            param :contenu, String, required: true
            param :background_color, String, required: true

            get_and_check_carnet( params['uid_eleve'], user, :write )
            onglet = get_and_check_onglet( params['onglet_id'], user, :write )

            json onglet.add_saisy( uid: user[:uid],
                                   date_creation: DateTime.now,
                                   contenu: params['contenu'],
                                   back_color: params['background_color'] )
          end

          app.put "#{APP_PATH}/api/carnets/:uid_eleve/onglets/:onglet_id/saisies/:id" do
            param :uid_eleve, String, required: true
            param :onglet_id, Integer, required: true
            param :id, Integer, required: true
            param :contenu, String, required: false
            param :background_color, String, required: false

            get_and_check_carnet( params['uid_eleve'], user, :write )
            get_and_check_onglet( params['onglet_id'], user, :write )
            saisie = get_and_check_saisie( params['id'] )

            changed = false
            if params.key?('contenu')
              saisie.contenu = params['contenu']
              changed = true
            end
            if params.key?('background_color')
              saisie.back_color = params['background_color']
              changed = true
            end

            if changed
              saisie.date_modification = DateTime.now
              saisie.save
            end

            json saisie
          end

          app.delete "#{APP_PATH}/api/carnets/:uid_eleve/onglets/:onglet_id/saisies/:id" do
            param :uid_eleve, String, required: true
            param :onglet_id, Integer, required: true
            param :id, Integer, required: true

            get_and_check_carnet( params['uid_eleve'], user, :write )
            onglet = get_and_check_onglet( params['onglet_id'], user, :write )
            saisie = get_and_check_saisie( params['id'] )

            json onglet.remove_saisy( saisie )
          end
        end
      end
    end
  end
end
