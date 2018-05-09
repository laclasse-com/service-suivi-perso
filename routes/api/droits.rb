module Suivi
  module Routes
    module Api
      module Onglets
        module Droits
          def self.registered( app )
            app.get '/api/droits/?' do
              param :onglet_id, Integer
              param :onglets_ids, Array
              one_of :onglet_id, :onglets_ids

              if params.key?( 'onglet_id' )
                onglet = get_and_check_onglet( params['onglet_id'], user, :manage )

                return json( onglet.droits.map(&:to_hash) )
              elsif params.key?( 'onglets_ids' )
                droits = params['onglets_ids'].map { |onglet_id| get_and_check_onglet( onglet_id, user, :manage ).droits.map(&:to_hash) }
                                              .flatten
                                              .group_by { |d| "#{d[:uid]}#{d[:profile_type]}#{d[:sharable_id]}#{d[:group_id]}" }
                                              .to_a
                                              .map(&:last)
                                              .select { |ds| ds.length == params['onglets_ids'].length }
                                              .map do |grouped_droits|
                  droit = grouped_droits.first
                  droit[:ids] = grouped_droits.map { |d| d[:id] }
                  droit.delete( :id )

                  droit
                end

                json( droits )
              end
            end

            app.post '/api/droits/?' do
              param :onglets_ids, Array, required: true
              param :read, :boolean, required: true
              param :write, :boolean, required: true
              param :manage, :boolean, required: true

              param :uid, String
              param :profile_type, String
              param :group_id, String
              param :sharable_id, String
              one_of :uid, :profile_type, :group_id, :sharable_id

              droits_hashes = params['onglets_ids'].map do |onglet_id|
                onglet = get_and_check_onglet( onglet_id, user, :manage )

                droit = Droit[ onglet_id: onglet_id,
                               uid: params['uid'],
                               profile_type: params['profile_type'],
                               group_id: params['group_id'],
                               sharable_id: params['sharable_id'],
                               read: params['read'],
                               write: params['write'],
                               manage: params['manage'] ]
                return droit.to_hash unless droit.nil?

                droit = {}
                %w[uid profile_type group_id read write manage].each do |key|
                  droit[ key ] = params[key] if params.key?( key )
                end
                droit['sharable_id'] = params.key?( 'sharable_id' ) && !params['sharable_id'].nil? && !params['sharable_id'].empty? ? params['sharable_id'] : nil

                onglet.add_droit( droit ).to_hash
              end

              json( droits_hashes )
            end

            app.put '/api/droits/:droit_id' do
              param :droit_id, Integer, required: true
              param :read, :boolean, required: true
              param :write, :boolean, required: true
              param :manage, :boolean, required: true

              param :uid, String
              param :profile_type, String
              param :group_id, String
              param :sharable_id, String
              one_of :uid, :profile_type, :group_id, :sharable_id

              droit = Droit[params['droit_id']]
              halt( 404, '404 Unknown droit' ) if droit.nil?

              get_and_check_onglet( droit.onglet_id, user, :manage )

              %w[uid profile_type group_id read write manage].each do |key|
                droit.update( key => params[key] ) if params.key?( key )
              end
              droit['sharable_id'] = params.key?( 'sharable_id' ) && !params['sharable_id'].nil? && !params['sharable_id'].empty? ? params['sharable_id'] : nil
              droit.save

              json( droit.to_hash )
            end

            app.put '/api/droits/?' do
              param :ids, Array, required: true
              param :read, :boolean, required: true
              param :write, :boolean, required: true
              param :manage, :boolean, required: true

              param :uid, String
              param :profile_type, String
              param :group_id, String
              param :sharable_id, String
              one_of :uid, :profile_type, :group_id, :sharable_id

              droits = Droit.where(id: params['ids']).all
              halt( 404, '404 Unknown droit' ) if droits.length != params['ids'].length

              droits.map do |droit|
                get_and_check_onglet( droit.onglet_id, user, :manage )

                %w[uid profile_type group_id read write manage].each do |key|
                  droit.update( key => params[key] ) if params.key?( key )
                end
                droit['sharable_id'] = params.key?( 'sharable_id' ) && !params['sharable_id'].nil? && !params['sharable_id'].empty? ? params['sharable_id'] : nil

                droit.save
              end

              json( droits.map(&:to_hash) )
            end

            app.delete '/api/droits/:droit_id' do
              param :droit_id, Integer, required: true

              droit = Droit[id: params['droit_id']]
              halt( 404, '404 Unknown droit' ) if droit.nil?

              get_and_check_onglet( droit.onglet_id, user, :manage )

              json( droit.destroy )
            end

            app.delete '/api/droits/?' do
              param :ids, Array, required: true

              droits = Droit.where(id: params['ids']).all
              halt( 404, '404 Unknown droit' ) if droits.length != params['ids'].length

              json( droits.map do |droit|
                      get_and_check_onglet( droit.onglet_id, user, :manage )

                      droit.destroy
                    end )
            end
          end
        end
      end
    end
  end
end
