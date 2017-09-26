# -*- coding: utf-8 -*-

module Suivi
  module Routes
    module Api
      module Onglets
        module Droits
          def self.registered( app )
            app.get '/api/droits/?' do
              onglet = get_and_check_onglet( params['onglet_id'], user, :manage )

              json( onglet.droits.map(&:to_hash) )
            end

            app.post '/api/droits/?' do
              halt( 400, '400 missing parameter' ) unless ( params.key?('uid') || params.key?('profil_id') || params.key?('sharable_id') ) && ( params.key?('read') || params.key?('write') )

              onglet = get_and_check_onglet( params['onglet_id'], user, :manage )

              droit = Droit[ uid: params['uid'],
                             profil_id: params['profil_id'],
                             onglet_id: params['onglet_id'],
                             sharable_id: params['sharable_id'],
                             read: params['read'],
                             write: params['write'],
                             manage: params['manage'] ]
              return json( droit.to_hash ) unless droit.nil?

              droit = {}
              %w[uid profil_id read write manage].each do |key|
                droit[ key ] = params[ key ] if params.key?( key )
              end
              droit['sharable_id'] = params.key?( 'sharable_id' ) && !params['sharable_id'].empty? ? params['sharable_id'] : nil

              json( onglet.add_droit( droit ).to_hash )
            end

            app.put '/api/:droit_id' do
              halt( 400, '400 missing parameter' ) unless ( params.key?('uid') || params.key?('profil_id') || params.key?('sharable_id') ) && ( params.key?('read') || params.key?('write') )

              droit = Droit[params['droit_id']]
              halt( 404, '404 Unknown droit' ) if droit.nil?

              get_and_check_onglet( droit.onglet_id, user, :manage )

              %w[uid profil_id read write manage].each do |key|
                droit.update( key => params[ key ] ) if params.key?( key )
              end
              droit['sharable_id'] = params.key?( 'sharable_id' ) && !params['sharable_id'].empty? ? params['sharable_id'] : nil
              droit.save

              json( droit.to_hash )
            end

            app.delete '/api/droits/:droit_id' do
              droit = Droit[id: params['droit_id']]
              halt( 404, '404 Unknown droit' ) if droit.nil?

              get_and_check_onglet( droit.onglet_id, user, :manage )

              json( droit.destroy )
            end
          end
        end
      end
    end
  end
end
