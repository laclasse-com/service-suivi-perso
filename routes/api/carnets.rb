# -*- coding: utf-8 -*-

module Suivi
  module Routes
    module Api
      module Carnets
        def self.registered( app )
          app.get '/api/carnets/contributed/:uid' do
            param :uid, String, required: true

            halt( 401, '401' ) if params['uid'] != user[:uid]

            json( Carnet.where( id: Onglet.where( id: Saisie.where( uid: params['uid'] )
                                                            .select( :onglet_id )
                                                            .all
                                                            .map(&:onglet_id) )
                                          .select( :carnet_id )
                                          .all
                                          .map(&:carnet_id) )
                        .all )
          end

          app.get '/api/carnets/:uid_eleve' do
            param :uid_eleve, String, required: true

            json get_and_check_carnet( params['uid_eleve'], user, :read )
          end
        end
      end
    end
  end
end
