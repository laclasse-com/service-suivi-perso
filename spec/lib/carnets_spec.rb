require File.expand_path '../../spec_helper.rb', __FILE__

describe 'CarnetsLibTest' do

	before(:all) do
		@bdd =BDD.new
		@bdd.clear_db
		@bdd.load_in_tables_of(init_data)
		CarnetsLib.set_current_user
	end

	after(:all) do
		@bdd.clear_db
	end

	it "retourne un liste de carnets" do 		
		carnets = CarnetsLib.list_carnets([carnets1.id, carnets2.id])
		carnets.size.should == 2
	end
end