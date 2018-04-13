module Suivi
  module Routes
    module Api
      module Onglets
        def self.registered( app )
          app.get '/api/onglets/?' do
            onglets_hashes = params['uids'].map do |uid_student|
              get_and_check_student_s_onglets( uid_student, user, :read )
                .map do |onglet|
                onglet_hash = onglet.to_hash
                onglet_hash[:writable] = onglet.allow?( user, :write )
                onglet_hash[:manageable] = onglet.allow?( user, :manage )

                onglet_hash
              end
            end

            json( onglets_hashes )
          end

          app.get '/api/onglets/:onglet_id' do
            onglet = get_and_check_onglet( params['onglet_id'], user, :read )
            onglet_hash = onglet.to_hash
            onglet_hash[:writable] = onglet.allow?( user, :write )
            onglet_hash[:manageable] = onglet.allow?( user, :manage )

            json( onglet_hash )
          end

          app.post '/api/onglets/?' do
            request.body.rewind
            body = JSON.parse( request.body.read )

            onglets_hashes = body['uids'].map do |uid_student|
              onglet = Onglet[uid_student: uid_student,
                              name: body['name']]

              new_onglet = onglet.nil?
              if new_onglet
                onglet = Onglet.create( uid_student: uid_student,
                                        name: body['name'],
                                        ctime: Time.now )

                onglet.init_droits( user )
              end

              onglet_hash = onglet.to_hash
              onglet_hash[:writable] = onglet.allow?( user, :write )
              onglet_hash[:manageable] = onglet.allow?( user, :manage )
              onglet_hash[:created] = new_onglet

              onglet_hash
            end

            json( onglets_hashes )
          end

          app.put '/api/onglets/:onglet_id' do
            request.body.rewind
            body = JSON.parse( request.body.read )

            onglet = get_and_check_onglet( params['onglet_id'], user, :manage )
            onglet.name = body['name'] if body.key?( 'name' )
            onglet.save

            onglet_hash = onglet.to_hash
            onglet_hash[:writable] = onglet.allow?( user, :write )
            onglet_hash[:manageable] = onglet.allow?( user, :manage )

            json( onglet_hash )
          end

          app.delete '/api/onglets/?' do
            json( params['ids'].map do |id|
                    onglet = get_and_check_onglet( id, user, :manage )

                    onglet_hash = onglet.destroy
                    onglet_hash[:deleted] = true

                    onglet_hash
                  end )
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
