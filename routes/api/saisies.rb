# -*- coding: utf-8 -*-

module Suivi
  module Routes
    module Api
      module Saisies
        def self.registered( app )
          app.get '/api/carnets/:uid_eleve/onglets/:onglet_id/saisies/?' do
            param :uid_eleve, String, required: true # unused
            param :onglet_id, Integer, required: true

            onglet = get_and_check_onglet( params['onglet_id'], user, :read )

            json( onglet.saisies )
          end

          app.get '/api/carnets/:uid_eleve/onglets/:onglet_id/saisies/:id' do
            param :uid_eleve, String, required: true # unused
            param :onglet_id, Integer, required: true
            param :id, Integer, required: true

            get_and_check_onglet( params['onglet_id'], user, :read )

            json( get_and_check_saisie( params['id'], user, :read ) )
          end

          app.post '/api/carnets/:uid_eleve/onglets/:onglet_id/saisies/?' do
            param :uid_eleve, String, required: true # unused
            param :onglet_id, Integer, required: true
            param :contenu, String, required: true

            onglet = get_and_check_onglet( params['onglet_id'], user, :write )

            saisie = onglet.add_saisy( uid_author: user[:uid],
                                       date_creation: DateTime.now,
                                       date_modification: DateTime.now,
                                       contenu: params['contenu'] )

            json( saisie )
          end

          app.put '/api/carnets/:uid_eleve/onglets/:onglet_id/saisies/:id' do
            param :uid_eleve, String, required: true # unused
            param :onglet_id, Integer, required: true
            param :id, Integer, required: true
            param :contenu, String, required: false

            get_and_check_onglet( params['onglet_id'], user, :write )
            saisie = get_and_check_saisie( params['id'], user, :write )

            if params.key?('contenu')
              saisie.contenu = params['contenu']
              saisie.date_modification = DateTime.now

              saisie.save
            end

            json( saisie )
          end

          app.delete '/api/carnets/:uid_eleve/onglets/:onglet_id/saisies/:id' do
            param :uid_eleve, String, required: true # unused
            param :onglet_id, Integer, required: true
            param :id, Integer, required: true

            get_and_check_onglet( params['onglet_id'], user, :write )
            saisie = get_and_check_saisie( params['id'], user, :write )

            json( saisie.destroy )
          end
        end
      end
    end
  end
end
