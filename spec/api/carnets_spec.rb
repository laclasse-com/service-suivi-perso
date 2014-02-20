require File.expand_path '../../spec_helper.rb', __FILE__

describe 'CarnetsTest' do

	before(:all) do
		@bdd =BDD.new
		@bdd.clear_db
		@bdd.load_in_tables_of(init_data)
		CarnetsLib.set_current_user
	end

	after(:all) do
		@bdd.clear_db
	end

	it "retourne les carnets d'un utilisateur d'e.vignal" do       
		get '/carnets/evignal/'+user_uid     
		last_response.should be_ok
		JSON.parse(last_response.body).size.should == 5
	end 

end