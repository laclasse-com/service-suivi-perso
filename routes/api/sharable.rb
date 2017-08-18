module Suivi
  module Routes
    module Api
      module Sharable
        def self.registered( app )
          app.get '/api/sharable/:sharable_id/?' do
            json( Onglet.where(id: Droit.where(sharable_id: params[:sharable_id] )
                                        .select(:onglet_id)
                                        .all
                                        .map(&:onglet_id)
                                        .compact )
                        .all
                        .map do |onglet|
                    onglet_hash = onglet.to_hash
                    onglet_hash[:writable] = false
                    onglet_hash[:uid_eleve] = onglet.carnets.uid_eleve

                    onglet_hash
                  end )
          end
        end
      end
    end
  end
end
