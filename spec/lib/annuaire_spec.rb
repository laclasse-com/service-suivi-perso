require File.expand_path '../../spec_helper.rb', __FILE__

describe 'AnnuaireTest' do

	before(:all) do
		@bdd =BDD.new
		@bdd.clear_db
		@bdd.load_in_tables_of(init_data)
		CarnetsLib.set_current_user
	end

	after(:all) do
		@bdd.clear_db
	end

	it 'retourne une url signée avec la bonne clé' do
		url_signed = Annuaire.sign(ANNUAIRE[:url], ANNUAIRE[:service_test], {"expand" => "true"}, ANNUAIRE[:secret], ANNUAIRE[:app_id])
		url_signed.should == url_test_signed
	end

	it 'retourne une url signée avec une fausse clé' do
		url_signed = Annuaire.sign(ANNUAIRE[:url], ANNUAIRE[:service_test], {"expand" => "true"}, FAKE_KEY_TEST, ANNUAIRE[:app_id])
		url_signed.should_not == url_test_signed
	end

	it "retourne les informations des utilisateurs mis en paramètre" do
		response = Annuaire.get_users_info_of(uid_eleve_of_user)
		response.should == response_service_users
	end

	it "retourne les informations de l'annuaire d'un uilisateur" do 
		response = Annuaire.get_info_annuaire_of user_uid
		response.should == USER
	end

	it "retourne une liste de carnets d'un utilisateur e vignal" do
		response = Annuaire.get_list_carnets_of(user_uid)
		response.size.should == 5
	end
end