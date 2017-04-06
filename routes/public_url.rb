# -*- coding: utf-8 -*-

module Suivi
  module Routes
    module PublicUrl
      def self.registered( app )
        app.get '/public/:url' do
          begin
            carnet = Carnet[url_publique: params[:url]]
            tabs = CarnetsLib.tab_list( carnet.uid_elv, nil, params[:url] )

            response = Laclasse::CrossApp::Sender.send_request_signed( :service_annuaire_user, carnet.uid_elv, 'expand' => 'true' )

            @aside_public_carnet = HtmlMessageGenerator.aside_public_carnet( response )
            @main_public_carnet = HtmlMessageGenerator.main_public_carnet( tabs )

            erb :carnet_public
          rescue Exception => e
            puts e.message
            status 404
            erb :erreur
          end
        end
      end
    end
  end
end
