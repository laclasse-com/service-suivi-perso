
class Api < Grape::API
format :json
rescue_from :all

helpers AuthenticationHelpers


before do
  	error!( '401 Unauthorized', 401 ) unless is_logged?
    get_current_user
end

resource(:annuaire) { mount AnnuaireApi }
resource(:carnets) { mount CarnetsApi }
resource(:onglets) { mount OngletsApi }
resource(:entrees) { mount EntreesApi }
resource(:rights) { mount RightsApi }

add_swagger_documentation 
end
