module Suivi
  module Routes
    module Api
      module Onglets
        def self.registered( app )
          app.get '/api/onglets/?' do
            param :uids, Array, required: true

            json( get_and_check_students_onglets( params['uids'], user, :read )
                    .map do |onglet|
                    onglet_hash = onglet.to_hash
                    onglet_hash[:writable] = onglet.allow?( user, :write )
                    onglet_hash[:manageable] = onglet.allow?( user, :manage )

                    onglet_hash
                  end )
          end

          app.get '/api/onglets/:onglet_id' do
            param :onglet_id, Integer, required: true

            onglet = get_and_check_onglet( params['onglet_id'], user, :read )
            onglet_hash = onglet.to_hash
            onglet_hash[:writable] = onglet.allow?( user, :write )
            onglet_hash[:manageable] = onglet.allow?( user, :manage )

            json( onglet_hash )
          end

          app.post '/api/onglets/?' do
            param :names, Array, required: true
            param :uids, Array, required: true

            onglets_hashes = params['names'].map do |name|
              params['uids'].map do |uid_student|
                onglet = Onglet[uid_student: uid_student,
                                name: name]

                new_onglet = onglet.nil?
                if new_onglet
                  onglet = Onglet.create( uid_student: uid_student,
                                          name: name,
                                          ctime: Time.now )

                  onglet.init_droits( user )
                end

                onglet_hash = onglet.to_hash
                onglet_hash[:writable] = onglet.allow?( user, :write )
                onglet_hash[:manageable] = onglet.allow?( user, :manage )
                onglet_hash[:created] = new_onglet

                onglet_hash
              end
            end
                                            .flatten

            json( onglets_hashes )
          end

          app.put '/api/onglets/:onglet_id' do
            param :onglet_id, Integer, required: true
            param :name, String, required: false

            onglet = get_and_check_onglet( params['onglet_id'], user, :manage )
            if params.key?( 'name' )
              onglet.name = params['name']
              onglet.save
            end

            onglet_hash = onglet.to_hash
            onglet_hash[:writable] = onglet.allow?( user, :write )
            onglet_hash[:manageable] = onglet.allow?( user, :manage )

            json( onglet_hash )
          end

          app.delete '/api/onglets/?' do
            param :ids, Array, required: true

            json( params['ids'].map do |id|
                    onglet = get_and_check_onglet( id, user, :manage )

                    onglet_hash = onglet.destroy
                    onglet_hash[:deleted] = true

                    onglet_hash
                  end )
          end

          app.delete '/api/onglets/:onglet_id' do
            param :onglet_id, Integer, required: true

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
