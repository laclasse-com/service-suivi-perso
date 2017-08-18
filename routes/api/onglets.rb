# -*- coding: utf-8 -*-

module Suivi
  module Routes
    module Api
      module Onglets
        def self.registered( app )
          app.get '/api/carnets/:uid_eleve/onglets/?' do
            json( get_and_check_carnet( params['uid_eleve'] )
                    .onglets
                    .select { |onglet| onglet.allow?( user, :read ) }
                    .map do |onglet|
                    onglet_hash = onglet.to_hash
                    onglet_hash[:writable] = onglet.allow?( user, :write )

                    onglet_hash
                  end )
          end

          app.get '/api/carnets/:uid_eleve/onglets/:onglet_id' do
            onglet = get_and_check_onglet( params['onglet_id'], user, :read )
            onglet_hash = onglet.to_hash
            onglet_hash[:writable] = onglet.allow?( user, :write )

            json( onglet_hash )
          end

          app.post '/api/carnets/:uid_eleve/onglets/?' do
            carnet = get_and_check_carnet( params['uid_eleve'] )
            onglet = carnet.onglets_dataset[nom: params['nom']]

            if onglet.nil?
              onglet = Onglet.create( carnet_id: carnet.id,
                                      nom: params['nom'],
                                      date_creation: DateTime.now )

              onglet.init_droits( DEFAULT_RIGHTS[:Onglet], user )
            end

            onglet_hash = onglet.to_hash
            onglet_hash[:writable] = onglet.allow?( user, :write )
            onglet_hash[:created] = true

            json( onglet_hash )
          end

          app.put '/api/carnets/:uid_eleve/onglets/:onglet_id' do
            onglet = get_and_check_onglet( params['onglet_id'], user, :write )
            onglet.nom = params['nom'] if params.key?( 'nom' )
            onglet.save

            onglet_hash = onglet.to_hash
            onglet_hash[:writable] = onglet.allow?( user, :write )

            json( onglet_hash )
          end

          app.delete '/api/carnets/:uid_eleve/onglets/:onglet_id' do
            onglet = get_and_check_onglet( params['onglet_id'], user, :write )

            onglet_hash = onglet.destroy
            onglet_hash[:deleted] = true

            json( onglet_hash )
          end
        end
      end
    end
  end
end
