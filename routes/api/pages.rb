module Suivi
    module Routes
        module Api
            module Pages
                def self.registered( app )
                    app.get '/api/pages/?' do
                        param :uids, Array, required: true

                        json( get_and_check_students_pages( params['uids'], user, :read )
                                  .map do |page|
                                  page_hash = page.to_hash
                                  page_hash[:writable] = page.allow?( user, :write )
                                  page_hash[:manageable] = page.allow?( user, :manage )

                                  page_hash
                              end )
                    end

                    app.get '/api/pages/:page_id' do
                        param :page_id, Integer, required: true

                        page = get_and_check_page( params['page_id'], user, :read )
                        page_hash = page.to_hash
                        page_hash[:writable] = page.allow?( user, :write )
                        page_hash[:manageable] = page.allow?( user, :manage )

                        json( page_hash )
                    end

                    app.post '/api/pages/?' do
                        param :names, Array, required: true
                        param :uids, Array, required: true

                        pages_hashes = params['names'].map do |name|
                            params['uids'].map do |uid_student|
                                page = Page[uid_student: uid_student,
                                            name: name]

                                new_page = page.nil?
                                if new_page
                                    page = Page.create( uid_student: uid_student,
                                                        name: name,
                                                        ctime: Time.now )

                                    page.init_rights( user )
                                end

                                page_hash = page.to_hash
                                page_hash[:writable] = page.allow?( user, :write )
                                page_hash[:manageable] = page.allow?( user, :manage )
                                page_hash[:created] = new_page

                                page_hash
                            end
                        end
                                                      .flatten

                        json( pages_hashes )
                    end

                    app.put '/api/pages/:page_id' do
                        param :page_id, Integer, required: true
                        param :name, String, required: true

                        page = get_and_check_page( params['page_id'], user, :manage )

                        page.name = params['name']
                        page.save

                        page_hash = page.to_hash
                        page_hash[:writable] = page.allow?( user, :write )
                        page_hash[:manageable] = page.allow?( user, :manage )

                        json( page_hash )
                    end

                    app.delete '/api/pages/?' do
                        param :ids, Array, required: true

                        json( params['ids'].map do |id|
                                  page = get_and_check_page( id, user, :manage )

                                  page_hash = page.destroy
                                  page_hash[:deleted] = true

                                  page_hash
                              end )
                    end

                    app.delete '/api/pages/:page_id' do
                        param :page_id, Integer, required: true

                        page = get_and_check_page( params['page_id'], user, :manage )

                        page_hash = page.destroy
                        page_hash[:deleted] = true

                        json( page_hash )
                    end
                end
            end
        end
    end
end
