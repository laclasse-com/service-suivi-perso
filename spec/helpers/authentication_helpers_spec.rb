require File.expand_path '../../spec_helper.rb', __FILE__

class AuthenticationHelpersTest
end

describe 'AuthenticationHelpersTest' do 

	before(:all) do
		@auten_helper_test = AuthenticationHelpersTest.new
		@auten_helper_test.extend AuthenticationHelpers
	end

	# it 'initialisation de la session' do
	# 	puts session.inspect
	# 	@auten_helper_test.init_session(env)
	# end
	
	# it "retourne le resultat permettant de dire si l'utilisateur est authentifié" do
	# 	response = @auten_helper_test.is_logged?
	# end
end