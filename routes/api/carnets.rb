# -*- coding: utf-8 -*-

module Suivi
  module Routes
    module Api
      module Carnets
        def self.registered( app )
          app.get '/api/carnets/:uid_eleve' do
            json( get_and_check_carnet( params['uid_eleve'] ) )
          end

          app.get '/api/carnets/relevant/:uid' do
            halt( 401, '401' ) if params['uid'] != user['id']

            json( Carnet.where( id: Onglet.where( id: Saisie.where( uid_author: params['uid'] )
                                                            .select( :onglet_id )
                                                            .all
                                                            .map(&:onglet_id)
                                                            .concat( Droit.where( uid: params['uid'] )
                                                                          .or( group_id: LaClasse::User.groups(user).map { |group| group['group_id'] } )
                                                                          .select( :onglet_id )
                                                                          .all
                                                                          .map(&:onglet_id) ) )
                                          .select( :carnet_id )
                                          .all
                                          .map(&:carnet_id) )
                        .all )
          end
        end
      end
    end
  end
end
