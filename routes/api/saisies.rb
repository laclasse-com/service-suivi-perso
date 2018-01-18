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
                                    date_creation: Time.now,
                                    date_modification: Time.now,
                                    contenu: body['contenu'],
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

            if body.key?('contenu') || body.key?('pinned')
              saisie.contenu = body['contenu'] if body.key?('contenu')
              saisie.pinned = body['pinned'] if body.key?('pinned')
              saisie.date_modification = Time.now

              saisie.save
            end

            json( saisie )
          end

          app.delete '/api/saisies/:id' do
            saisie = get_and_check_saisie( params['id'], user, :write )
            saisie.onglets.each do |onglet|
              get_and_check_onglet( onglet.id, user, :write )
            end

            saisie.remove_all_onglets
            saisie.remove_all_ressources

            json( saisie.destroy )
          end
        end
      end
    end
  end
end
