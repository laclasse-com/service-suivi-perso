# -*- coding: utf-8 -*-

module Suivi
  module Routes
    module Api
      module Onglets
        def self.registered( app )
          app.get '/api/onglets/?' do
            json( get_and_check_carnet( params['uid_eleve'] )
                    .onglets
                    .select { |onglet| onglet.allow?( user, :read ) }
                    .map do |onglet|
                    onglet_hash = onglet.to_hash
                    onglet_hash[:writable] = onglet.allow?( user, :write )
                    onglet_hash[:manageable] = onglet.allow?( user, :manage )

                    onglet_hash
                  end )
          end

          app.get '/api/onglets/:onglet_id' do
            onglet = get_and_check_onglet( params['onglet_id'], user, :read )
            onglet_hash = onglet.to_hash
            onglet_hash[:writable] = onglet.allow?( user, :write )
            onglet_hash[:manageable] = onglet.allow?( user, :manage )

            json( onglet_hash )
          end

          app.post '/api/onglets/?' do
            carnet = get_and_check_carnet( params['uid_eleve'] )
            onglet = carnet.onglets_dataset[nom: params['nom']]

            new_onglet = onglet.nil?
            if new_onglet
              onglet = Onglet.create( carnet_id: carnet.id,
                                      nom: params['nom'],
                                      date_creation: DateTime.now )

              onglet.init_droits( DEFAULT_RIGHTS[:Onglet], user )
            end

            onglet_hash = onglet.to_hash
            onglet_hash[:writable] = onglet.allow?( user, :write )
            onglet_hash[:manageable] = onglet.allow?( user, :manage )
            onglet_hash[:created] = new_onglet

            json( onglet_hash )
          end

          app.put '/api/onglets/:onglet_id' do
            onglet = get_and_check_onglet( params['onglet_id'], user, :manage )
            onglet.nom = params['nom'] if params.key?( 'nom' )
            onglet.save

            onglet_hash = onglet.to_hash
            onglet_hash[:writable] = onglet.allow?( user, :write )
            onglet_hash[:manageable] = onglet.allow?( user, :manage )

            json( onglet_hash )
          end

          app.delete '/api/onglets/:onglet_id' do
            onglet = get_and_check_onglet( params['onglet_id'], user, :manage )

            onglet_hash = onglet.destroy
            onglet_hash[:deleted] = true

            json( onglet_hash )
          end
        end
      end
    end
  end
end
