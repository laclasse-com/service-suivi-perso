module Suivi
  module Routes
    module Api
      module Onglets
        def self.registered( app )
          app.get '/api/onglets/?' do
            single = params.key?('uid')

            uids = single ? [params['uid']] : params['uids']

            onglets_hashes = uids.map do |uid_eleve|
              get_and_check_carnet( uid_eleve )
                .onglets
                .select { |onglet| onglet.allow?( user, :read ) }
                .map do |onglet|
                onglet_hash = onglet.to_hash
                onglet_hash[:writable] = onglet.allow?( user, :write )
                onglet_hash[:manageable] = onglet.allow?( user, :manage )

                onglet_hash
              end
            end

            json( single ? onglets_hashes.first : onglets_hashes )
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
            single = body.key?('uid')

            uids = single ? [body['uid']] : body['uids']

            onglets_hashes = uids.map do |uid_eleve|
              carnet = get_and_check_carnet( uid_eleve )
              onglet = carnet.onglets_dataset[nom: params['nom']]

              new_onglet = onglet.nil?
              if new_onglet
                onglet = Onglet.create( carnet_id: carnet.id,
                                        nom: params['nom'],
                                        date_creation: Time.now )

                onglet.init_droits( user )
              end

              onglet_hash = onglet.to_hash
              onglet_hash[:writable] = onglet.allow?( user, :write )
              onglet_hash[:manageable] = onglet.allow?( user, :manage )
              onglet_hash[:created] = new_onglet

              onglet_hash
            end

            json( single ? onglets_hashes.first : { multiple: true, data: onglets_hashes } )
          end

          app.put '/api/onglets/:onglet_id' do
            onglet = get_and_check_onglet( params['onglet_id'], user, :manage )
            onglet.nom = params['nom'] if params.key?( 'nom' )
            onglet.save

            onglet_hash = onglet.to_hash
            onglet_hash[:writable] = onglet.allow?( user, :write )
            onglet_hash[:manageable] = onglet.allow?( user, :manage )

            json( onglet_hash )
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
