module Suivi
  module Routes
    module Api
      module Saisies
        def self.registered( app )
          app.get '/api/saisies/?' do
            if params['onglets_ids'].length == 1
              onglet = get_and_check_onglet( params['onglets_ids'].first, user, :read )

              return json( onglet.saisies )
            else
              result = params['onglets_ids'].map do |oid|
                get_and_check_onglet( oid, user, :read )

                Saisie.association_join(:onglets)
                      .where(onglet_id: oid)
                      .select_all(:saisies)
                      .all
              end

              first_onglet_saisies = result.shift
              result = result.reduce( first_onglet_saisies ) { |memo, onglet_saisies| memo & onglet_saisies }

              return json( result )
            end
          end

          app.post '/api/saisies/?' do
            request.body.rewind
            body = JSON.parse( request.body.read )

            saisie = Saisie.create( uid_author: user['id'],
                                    ctime: Time.now,
                                    mtime: Time.now,
                                    content: body['content'],
                                    pinned: body['pinned'] )

            body['onglets_ids'].each do |onglet_id|
              onglet = get_and_check_onglet( onglet_id, user, :write )

              saisie = onglet.add_saisy( saisie )
            end

            json( saisie )
          end

          app.get '/api/saisies/:id' do
            saisie = get_and_check_saisie( params['id'], user, :read )
            saisie.onglets.reduce( false ) do |memo, onglet|
              memo || check_onglet( onglet.id, user, :read )
            end

            json( saisie )
          end

          app.put '/api/saisies/:id' do
            request.body.rewind
            body = JSON.parse( request.body.read )

            saisie = get_and_check_saisie( params['id'], user, :write )
            saisie.onglets.each do |onglet|
              get_and_check_onglet( onglet.id, user, :write )
            end

            if body.key?('content') || body.key?('pinned')
              saisie.content = body['content'] if body.key?('content')
              saisie.pinned = body['pinned'] if body.key?('pinned')
              saisie.mtime = Time.now

              saisie.save
            end

            json( saisie )
          end

          app.delete '/api/saisies/:id' do
            saisie = get_and_check_saisie( params['id'], user, :write )

            params['onglets_ids'].each do |onglet_id|
              onglet = get_and_check_onglet( onglet_id, user, :write )

              onglet.remove_saisy( saisie )
            end

            json( saisie.destroy ) if saisie.onglets.empty?
          end
        end
      end
    end
  end
end
