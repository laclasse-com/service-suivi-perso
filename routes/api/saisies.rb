# -*- coding: utf-8 -*-

module Suivi
  module Routes
    module Api
      module Saisies
        def self.registered( app )
          app.get '/api/saisies/?' do
            onglet = get_and_check_onglet( params['onglet_id'], user, :read )

            json( onglet.saisies )
          end

          app.post '/api/saisies/?' do
            onglet = get_and_check_onglet( params['onglet_id'], user, :write )

            saisie = onglet.add_saisy( uid_author: user['id'],
                                       date_creation: DateTime.now,
                                       date_modification: DateTime.now,
                                       contenu: params['contenu'],
                                       pinned: params['pinned'] )

            json( saisie )
          end

          app.get '/api/saisies/:id' do
            saisie = get_and_check_saisie( params['id'], user, :read )
            get_and_check_onglet( saisie.onglet_id, user, :read )

            json( saisie )
          end

          app.put '/api/saisies/:id' do
            saisie = get_and_check_saisie( params['id'], user, :write )
            get_and_check_onglet( saisie.onglet_id, user, :write )

            if params.key?('contenu') || params.key?('pinned')
              saisie.contenu = params['contenu'] if params.key?('contenu')
              saisie.pinned = params['pinned'] if params.key?('pinned')
              saisie.date_modification = DateTime.now

              saisie.save
            end

            json( saisie )
          end

          app.delete '/api/saisies/:id' do
            saisie = get_and_check_saisie( params['id'], user, :write )
            get_and_check_onglet( saisie.onglet_id, user, :write )

            json( saisie.destroy )
          end
        end
      end
    end
  end
end
