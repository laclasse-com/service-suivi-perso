module Suivi
  module Routes
    module Api
      module Students
        def self.registered( app )
          app.get '/api/students/relevant/:uid' do
            halt( 401, '401' ) if params['uid'] != user['id']

            json( Onglet.where( id: Saisie.where( uid_author: params['uid'] )
                                          .association_join( :onglets )
                                          .select( :onglet_id )
                                          .all
                                          .map { |s| s[:onglet_id] }
                                          .concat( Droit.where( uid: params['uid'] )
                                                        .or( group_id: LaClasse::User.groups(user).map { |group| group['group_id'] } )
                                                        .select( :onglet_id )
                                                        .all
                                                        .map( &:onglet_id ) ) )
                        .select( :uid_student )
                        .all
                        .map( &:uid_student ) )
          end
        end
      end
    end
  end
end
