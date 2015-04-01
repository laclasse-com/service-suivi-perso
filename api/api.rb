require 'laclasse/helpers/authentication'
require 'laclasse/cross_app/sender'

# Point d'entrée des APi du suivi
class Api < Grape::API
  format :json
  rescue_from :all

  helpers AuthenticationHelpers
  helpers Laclasse::Helpers::Authentication

  before do
    error!( '401 Unauthorized', 401 ) unless logged?
    get_current_user
  end

  resource(:annuaire) { mount AnnuaireApi }
  resource(:docs) { mount DocsApi }
  resource(:carnets) { mount CarnetsApi }
  resource(:onglets) { mount OngletsApi }
  resource(:entrees) { mount EntreesApi }
  resource(:rights) { mount RightsApi }
  resource(:public) { mount PublicUrlApi }
  resource(:stats) { mount StatsApi }

  add_swagger_documentation
end
