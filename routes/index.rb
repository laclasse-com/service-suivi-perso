# -*- coding: utf-8 -*-

module Suivi
  module Routes
    module Index
      def self.registered( app )
        app.get "#{APP_PATH}/?" do
          erb :app
        end
      end
    end
  end
end
