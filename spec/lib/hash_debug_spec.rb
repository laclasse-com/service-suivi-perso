require File.expand_path '../../spec_helper.rb', __FILE__

# class HashDebugTest
# end

describe 'HashDebugTest' do
	# include Hash
	# before(:all) do
	# 	@hash_debug = HashDebugTest.new
	# 	@hash_debug.extend Hash
	# end

	it "retourne une chaine sous forme de HTML" do
		hash_de_test.to_html.should == reponse_hash_debug
	end
end