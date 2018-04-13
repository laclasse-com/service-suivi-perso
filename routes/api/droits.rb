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
              request.body.rewind
              body = JSON.parse( request.body.read )

              halt( 400, '400 missing parameter' ) unless ( body.key?('uid') || body.key?('profile_type') || body.key?('group_id') || body.key?('sharable_id') ) && ( body.key?('read') || body.key?('write') )

              droits_hashes = body['onglets_ids'].map do |onglet_id|
                onglet = get_and_check_onglet( onglet_id, user, :manage )

                droit = Droit[ onglet_id: onglet_id,
                               uid: body['uid'],
                               profile_type: body['profile_type'],
                               group_id: body['group_id'],
                               sharable_id: body['sharable_id'],
                               read: body['read'],
                               write: body['write'],
                               manage: body['manage'] ]
                return droit.to_hash unless droit.nil?

                droit = {}
                %w[uid profile_type group_id read write manage].each do |key|
                  droit[ key ] = body[key] if body.key?( key )
                end
                droit['sharable_id'] = body.key?( 'sharable_id' ) && !body['sharable_id'].nil? && !body['sharable_id'].empty? ? body['sharable_id'] : nil

                onglet.add_droit( droit ).to_hash
              end

              json( droits_hashes )
            end

            app.put '/api/droits/:droit_id' do
              request.body.rewind
              body = JSON.parse( request.body.read )

              halt( 400, '400 missing parameter' ) unless ( body.key?('uid') || body.key?('profile_type') || body.key?('group_id') || body.key?('sharable_id') ) && ( body.key?('read') || body.key?('write') )

              droit = Droit[params['droit_id']]
              halt( 404, '404 Unknown droit' ) if droit.nil?

              get_and_check_onglet( droit.onglet_id, user, :manage )

              %w[uid profile_type group_id read write manage].each do |key|
                droit.update( key => body[key] ) if body.key?( key )
              end
              droit['sharable_id'] = body.key?( 'sharable_id' ) && !body['sharable_id'].nil? && !body['sharable_id'].empty? ? body['sharable_id'] : nil
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
