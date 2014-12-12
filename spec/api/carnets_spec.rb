require File.expand_path '../../spec_helper.rb', __FILE__

describe 'CarnetsApiTest' do

	before(:all) do
		@bdd =BDD.new
		@bdd.clear_db
		@bdd.load_in_tables_of(init_data)
	end

	after(:all) do
		@bdd.clear_db
	end

	it "retourne les carnets d'un utilisateur d'e.vignal" do       
		get '/carnets/evignal/'+user_uid     
		last_response.should be_ok
		JSON.parse(last_response.body).size.should == 16
	end 

	it "retourne tous les carnets d'un regroupement d'un utilisateur " do
		get "/carnets/regroupements/"+user_uid+"/1"
		last_response.should be_ok
		JSON.parse(last_response.body).size.should == 3
	end
end