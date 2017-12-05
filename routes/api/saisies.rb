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
            # request.body.rewind
            # body = JSON.parse( request.body.read )
            single = params.key?( 'onglet_id')

            onglets_ids = single ? [ params['onglet_id'] ] : params['onglets_ids']

            saisie = Saisie.create( uid_author: user['id'],
                                    date_creation: DateTime.now,
                                    date_modification: DateTime.now,
                                    contenu: params['contenu'],
                                    pinned: params['pinned'] )

            onglets_ids.each do |onglet_id|
              onglet = get_and_check_onglet( onglet_id, user, :write )

              saisie = onglet.add_saisy( saisie )
            end

            json( saisie )
          end

          app.get '/api/saisies/:id' do
            saisie = get_and_check_saisie( params['id'], user, :read )
            saisie.onglets.reduce( false ) do |memo, onglet|
              memo || check_onglet( onglet.id, user, :read )
            end

            json( saisie )
          end

          app.put '/api/saisies/:id' do
            saisie = get_and_check_saisie( params['id'], user, :write )
            saisie.onglets.each do |onglet|
              get_and_check_onglet( onglet.id, user, :write )
            end

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
            saisie.onglets.each do |onglet|
              get_and_check_onglet( onglet.id, user, :write )
            end

            json( saisie.destroy )
          end
        end
      end
    end
  end
end
