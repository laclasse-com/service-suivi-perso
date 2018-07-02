module Suivi
  module Routes
    module Api
      module Students
        def self.registered( app )
          app.get '/api/students/relevant/:uid' do
            param :uid, String, required: true

            halt( 401, '401' ) if params['uid'] != user['id']

            json( Page.where( id: Message.where( uid_author: params['uid'] )
                                          .association_join( :pages )
                                          .select( :page_id )
                                          .all
                                          .map { |s| s[:page_id] }
                                          .concat( Right.where( uid: params['uid'] )
                                                        .or( group_id: user['groups'].map { |group| group['group_id'] } )
                                                        .select( :page_id )
                                                        .all
                                                        .map( &:page_id ) ) )
                        .select( :uid_student )
                        .all
                        .map( &:uid_student ) )
          end
        end
      end
    end
  end
end
