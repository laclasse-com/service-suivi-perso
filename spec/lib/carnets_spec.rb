require File.expand_path '../../spec_helper.rb', __FILE__

describe 'CarnetsLibTest' do

	before(:all) do
		@bdd =BDD.new
		@bdd.clear_db
		@bdd.load_in_tables_of(init_data)
		CarnetsLib.set_current_user current_user
	end

	after(:all) do
		@bdd.clear_db
	end

	it "retourne un liste de carnets" do 		
		carnets = CarnetsLib.list_carnets([carnets1.id, carnets2.id])
		carnets.size.should == 16
	end

	it "retourne le carnet de l'id_carnet en paramètre dans une hash map" do
		carnet = CarnetsLib.get_carnet_of(carnets1.id)
		carnet.should == carnets1_hash
	end

	it "retourne true si l'uid d'un utilisateur a les droits sur le carnet d'un élève" do
		CarnetsLib.rights_on(carnets1.uid, user_uid).should be_true
	end

	it "retourne true si l'uid d'un utilisateur est celui de l'élève" do
		CarnetsLib.rights_on(carnets1.uid, carnets1.uid).should be_true
	end

	it "retourne false si l'uid d'un utilisateur n'a pas les droits sur le carnet d'un élève" do
		CarnetsLib.rights_on(carnets1.uid, carnets2.uid).should be_false
	end

	it "retourne un carnet vide" do
		CarnetsLib.carnet_vide.should == {:color => '', :avatar => '', :sexe => '', :uid => '', :nom => ' ', :prenom => ' ', :etablissement => '', :classe => ''}
	end

	it "ajoute les couleurs pour les carnets en paramètre" do
		carnets = CarnetsLib.couleurs_carnets([carnets1_hash, carnets2_hash], true)
		carnets[0][:color].should == PANEL_COLOR[0]
	end

	it "retourne une couleur pour l'avatar par rapport a la couleur du carnet" do
		[COLOR[:bleu],COLOR[:rouge],COLOR[:violet]].should include CarnetsLib.couleur_avatar(COLOR[:jaune])
		[COLOR[:jaune],COLOR[:rouge]].should include CarnetsLib.couleur_avatar(COLOR[:vert])
		[COLOR[:jaune],COLOR[:vert]].should include CarnetsLib.couleur_avatar(COLOR[:rouge])
		CarnetsLib.couleur_avatar(COLOR[:bleu]).should == COLOR[:jaune]
		CarnetsLib.couleur_avatar(COLOR[:violet]).should == COLOR[:jaune]
	end
end