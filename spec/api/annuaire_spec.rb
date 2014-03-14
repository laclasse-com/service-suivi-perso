
require File.expand_path '../../spec_helper.rb', __FILE__

describe 'AnnuaireApiTest' do

	###############################
	# EXEMPLE POUR TESTER LES API #
	###############################	
	# it "test annuaire" do       #
	# 	get '/annuaire/uid'       #
	# 	last_response.should be_ok#
	# end                         #
	###############################

	it "retourne la session rack de l'utilisateur" do
		get '/annuaire/user/session'
		last_response.should be_ok
		JSON.parse(last_response.body)["user"].should == current_user[:user]
	end

	it "retourne les informations sur l'utilisateurs" do       
		get '/annuaire/'+user_uid     
		last_response.should be_ok
		JSON.parse(last_response.body).should == USER
	end 

	it "Retourne tous les regroupements d'un utilisateur" do
		get '/annuaire/regroupements/'+user_uid
		last_response.should be_ok
		JSON.parse(last_response.body).should == 
	end
end
