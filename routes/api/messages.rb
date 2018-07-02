module Suivi
    module Routes
        module Api
            module Messages
                def self.registered( app )
                    app.get '/api/messages/?' do
                        param :pages_ids, Array, required: true

                        if params['pages_ids'].length == 1
                            page = get_and_check_page( params['pages_ids'].first, user, :read )

                            return json( page.messages )
                        else
                            result = params['pages_ids'].map do |oid|
                                get_and_check_page( oid, user, :read )

                                Message.association_join(:pages)
                                       .where(page_id: oid)
                                       .select_all(:messages)
                                       .all
                            end

                            first_page_messages = result.shift
                            result = result.reduce( first_page_messages ) { |memo, page_messages| memo & page_messages }

                            return json( result )
                        end
                    end

                    app.post '/api/messages/?' do
                        param :pages_ids, Array, required: true
                        param :content, String, required: true
                        param :pinned, :boolean, required: true

                        message = Message.create( uid_author: user['id'],
                                                  ctime: Time.now,
                                                  mtime: Time.now,
                                                  content: params['content'],
                                                  pinned: params['pinned'] )

                        params['pages_ids'].each do |page_id|
                            page = get_and_check_page( page_id, user, :write )

                            message = page.add_saisy( message )
                        end

                        json( message )
                    end

                    app.get '/api/messages/:id' do
                        param :id, Integer, required: true

                        message = get_and_check_message( params['id'], user, :read )
                        message.pages.reduce( false ) do |memo, page|
                            memo || check_page( page.id, user, :read )
                        end

                        json( message )
                    end

                    app.put '/api/messages/:id' do
                        param :id, Integer, required: true
                        param :content, String
                        param :pinned, :boolean
                        any_of :content, :pinned

                        message = get_and_check_message( params['id'], user, :write )
                        message.pages.each do |page|
                            get_and_check_page( page.id, user, :write )
                        end

                        message.content = params['content'] if params.key?('content')
                        message.pinned = params['pinned'] if params.key?('pinned')
                        message.mtime = Time.now

                        message.save

                        json( message )
                    end

                    app.delete '/api/messages/:id' do
                        param :id, Integer, required: true
                        param :pages_ids, Array, required: true

                        message = get_and_check_message( params['id'], user, :write )

                        params['pages_ids'].each do |page_id|
                            page = get_and_check_page( page_id, user, :write )

                            page.remove_saisy( message )
                        end

                        json( message.destroy ) if message.pages.empty?
                    end
                end
            end
        end
    end
end
