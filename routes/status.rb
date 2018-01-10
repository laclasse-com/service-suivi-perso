module Suivi
  module Routes
    module Status
      def self.registered( app )
        app.get '/status/?' do
          content_type :json

          status = 'OK'
          reason = 'L\'application fonctionne.'

          app_status = { app_id: ANNUAIRE[:app_id],
                         app_version: APP_VERSION,
                         rack_env: ENV['RACK_ENV'] }

          app_status[:status] = status
          app_status[:reason] = reason

          app_status.to_json
        end
      end
    end
  end
end
