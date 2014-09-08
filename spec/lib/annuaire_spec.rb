require File.expand_path '../../spec_helper.rb', __FILE__

describe 'AnnuaireTest' do

	before(:all) do
		@bdd =BDD.new
		@bdd.clear_db
		@bdd.load_in_tables_of(init_data)
		CarnetsLib.set_current_user current_user
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
		response.size.should == 16
	end

	it "tous les carnets créé pour un regroupement" do
		response = Annuaire.get_carnets_regroupement_of(user_uid, 1.to_s)
		response.size.should == 3
		response.include?(carnets2_hash).should be_true
	end

	it "retourne un hash d'un regroupements avec son id et son nom" do
		Annuaire.hash_regroupement(1, "4E", 9999).should  == {:id => 1, :nom => "4E", :etab_id => 9999}
	end

	it "retourne un etablissement avec ses classes et ses groupes" do
		reponse = Annuaire.regroupements_with_etabName(hash_etabs[0], hash_classes[0])
		reponse.should == {:id => 1, :nom => "6B", :etab_nom => "CLG-VAL D'ARGENT", :etab_id => 9999, :color => ''}
	end

	it "retourne une liste d'établissement avec ses classe et ses groupes" do
		reponse = Annuaire.liste_regroupements(hash_etabs, hash_classes, hash_groupes)
		reponse = [{:id => 1, :nom => "6B", :etab_nom => "CLG-VAL D'ARGENT", :etab_id => 9999, :color => ''},
		{:id => 7, :nom => "4E", :etab_nom => "CLG-TOTO", :etab_id => 9998, :color => ''},
    	{:id => 19, :nom => "4E_LV1", :etab_nom => "CLG-TOTO", :etab_id => 9998, :color => ''}]
    end

    it "récupère tous les regroupements pour un utilisateurs" do
    	reponse = Annuaire.get_regroupements_of user_uid
    	reponse.should == regroupements_user
    end
end