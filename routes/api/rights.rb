# frozen_string_literal: true

module Suivi
    module Routes
        module Api
            module Rights
                def self.registered( app )
                    app.get '/api/rights/?' do
                        param :page_id, Integer
                        param :pages_ids, Array
                        one_of :page_id, :pages_ids

                        if params.key?( 'page_id' )
                            page = get_and_check_page( params['page_id'], user, :manage )

                            return json( page.rights.map(&:to_hash) )
                        elsif params.key?( 'pages_ids' )
                            rights = params['pages_ids'].map { |page_id| get_and_check_page( page_id, user, :manage ).rights.map(&:to_hash) }
                                                        .flatten
                                                        .group_by { |d| "#{d[:uid]}#{d[:profile_type]}#{d[:sharable_id]}#{d[:group_id]}" }
                                                        .to_a
                                                        .map(&:last)
                                                        .select { |ds| ds.length == params['pages_ids'].length }
                                                        .map do |grouped_rights|
                                right = grouped_rights.first
                                right[:ids] = grouped_rights.map { |d| d[:id] }
                                right.delete( :id )

                                right
                            end

                            json( rights )
                        end
                    end

                    app.post '/api/rights/?' do
                        param :pages_ids, Array, required: true
                        param :read, :boolean, required: true
                        param :write, :boolean, required: true
                        param :manage, :boolean, required: true

                        param :uid, String
                        param :profile_type, String
                        param :group_id, String
                        param :sharable_id, String
                        one_of :uid, :profile_type, :group_id, :sharable_id

                        rights_hashes = params['pages_ids'].map do |page_id|
                            page = get_and_check_page( page_id, user, :manage )

                            right = Right[ page_id: page_id,
                                           uid: params['uid'],
                                           profile_type: params['profile_type'],
                                           group_id: params['group_id'],
                                           sharable_id: params['sharable_id'],
                                           read: params['read'],
                                           write: params['write'],
                                           manage: params['manage'] ]

                            if right.nil?
                                new_right = {}
                                %w[uid profile_type group_id read write manage].each do |key|
                                    new_right[ key ] = params[key] if params.key?( key )
                                end
                                new_right['sharable_id'] = params.key?( 'sharable_id' ) && !params['sharable_id'].nil? && !params['sharable_id'].empty? ? params['sharable_id'] : nil

                                right = page.add_right( new_right )
                            end

                            right.to_hash
                        end

                        json( rights_hashes )
                    end

                    app.put '/api/rights/:right_id' do
                        param :right_id, Integer, required: true
                        param :read, :boolean, required: true
                        param :write, :boolean, required: true
                        param :manage, :boolean, required: true

                        param :uid, String
                        param :profile_type, String
                        param :group_id, String
                        param :sharable_id, String
                        one_of :uid, :profile_type, :group_id, :sharable_id

                        right = Right[params['right_id']]
                        halt( 404, '404 Unknown right' ) if right.nil?

                        get_and_check_page( right.page_id, user, :manage )

                        %w[uid profile_type group_id read write manage].each do |key|
                            right.update( key => params[key] ) if params.key?( key )
                        end
                        right['sharable_id'] = params.key?( 'sharable_id' ) && !params['sharable_id'].nil? && !params['sharable_id'].empty? ? params['sharable_id'] : nil
                        right.save

                        json( right.to_hash )
                    end

                    app.put '/api/rights/?' do
                        param :ids, Array, required: true
                        param :read, :boolean, required: true
                        param :write, :boolean, required: true
                        param :manage, :boolean, required: true

                        param :uid, String
                        param :profile_type, String
                        param :group_id, String
                        param :sharable_id, String
                        one_of :uid, :profile_type, :group_id, :sharable_id

                        rights = Right.where(id: params['ids']).all
                        halt( 404, '404 Unknown right' ) if rights.length != params['ids'].length

                        rights.map do |right|
                            get_and_check_page( right.page_id, user, :manage )

                            %w[uid profile_type group_id read write manage].each do |key|
                                right.update( key => params[key] ) if params.key?( key )
                            end
                            right['sharable_id'] = params.key?( 'sharable_id' ) && !params['sharable_id'].nil? && !params['sharable_id'].empty? ? params['sharable_id'] : nil

                            right.save
                        end

                        json( rights.map(&:to_hash) )
                    end

                    app.delete '/api/rights/:right_id' do
                        param :right_id, Integer, required: true

                        right = Right[id: params['right_id']]
                        halt( 404, '404 Unknown right' ) if right.nil?

                        get_and_check_page( right.page_id, user, :manage )

                        json( right.destroy )
                    end

                    app.delete '/api/rights/?' do
                        param :ids, Array, required: true

                        rights = Right.where(id: params['ids']).all
                        halt( 404, '404 Unknown right' ) if rights.length != params['ids'].length

                        json( rights.map do |right|
                                  get_and_check_page( right.page_id, user, :manage )

                                  right.destroy
                              end )
                    end
                end
            end
        end
    end
end
