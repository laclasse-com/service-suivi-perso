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
              halt( 400, '400 missing parameter' ) unless ( params.key?('uid') || params.key?('profil_id') || params.key?('group_id') || params.key?('sharable_id') ) && ( params.key?('read') || params.key?('write') )

              request.body.rewind
              body = JSON.parse( request.body.read )
              single = body.key?('onglet_id')

              onglets_ids = single ? [body['onglet_id']] : body['onglets_ids']

              droits_hashes = onglets_ids.map do |onglet_id|
                onglet = get_and_check_onglet( onglet_id, user, :manage )

                droit = Droit[ onglet_id: onglet_id,
                               uid: params['uid'],
                               profil_id: params['profil_id'],
                               group_id: params['group_id'],
                               sharable_id: params['sharable_id'],
                               read: params['read'],
                               write: params['write'],
                               manage: params['manage'] ]
                return droit.to_hash unless droit.nil?

                droit = {}
                %w[uid profil_id group_id read write manage].each do |key|
                  droit[ key ] = params[key] if params.key?( key )
                end
                droit['sharable_id'] = params.key?( 'sharable_id' ) && !params['sharable_id'].empty? ? params['sharable_id'] : nil

                onglet.add_droit( droit ).to_hash
              end

              json( single ? droits_hashes.first : { multiple: true, data: droits_hashes } )
            end

            app.put '/api/droits/:droit_id' do
              halt( 400, '400 missing parameter' ) unless ( params.key?('uid') || params.key?('profil_id') || params.key?('group_id') || params.key?('sharable_id') ) && ( params.key?('read') || params.key?('write') )

              droit = Droit[params['droit_id']]
              halt( 404, '404 Unknown droit' ) if droit.nil?

              get_and_check_onglet( droit.onglet_id, user, :manage )

              %w[uid profil_id group_id read write manage].each do |key|
                droit.update( key => params[key] ) if params.key?( key )
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
