# coding: utf-8
require 'laclasse/helpers/authentication'
require 'laclasse/cross_app/sender'

require_relative './api/annuaire'
require_relative './api/docs'
require_relative './api/carnets'
require_relative './api/onglets'
require_relative './api/entrees'
require_relative './api/rights'
require_relative './api/public_url'
require_relative './api/stats'

# Point d'entrée des APi du suivi
class Api < Grape::API
  format :json
  rescue_from :all do |e|
    LOGGER.error e.message
    LOGGER.error e.backtrace[0..10]
    error!({ error: 'Server error.' }, 500, 'Content-Type' => 'text/error')
  end

  helpers URLHelpers
  helpers Laclasse::Helpers::Authentication

  before do
    error!( '401 Unauthorized', 401 ) unless logged?
  end

  resource(:annuaire) { mount AnnuaireApi }
  resource(:docs    ) { mount DocsApi }
  resource(:carnets ) { mount CarnetsApi }
  resource(:onglets ) { mount OngletsApi }
  resource(:entrees ) { mount EntreesApi }
  resource(:rights  ) { mount RightsApi }
  resource(:public  ) { mount PublicUrlApi }
  resource(:stats   ) { mount StatsApi }
end
