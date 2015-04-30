require File.expand_path '../../spec_helper.rb', __FILE__

describe 'Test du module HTML Message Generator' do
  class NonameClass
  end

  before(:each) do
    @hmg = NonameClass.new
    @hmg.extend(HtmlMessageGenerator)
  end

  it "revoie l'avatar Fille" do
    expect(@hmg.img_avatar('F')).to eq ('api/default_avatar/avatar_feminin.svg')
  end

  it "revoie l'avatar Mec" do
    expect(@hmg.img_avatar('M')).to eq ('api/default_avatar/avatar_masculin.svg')
  end

  it "revoie l'avatar Indéfini (sexe=x)" do
    expect(@hmg.img_avatar('X')).to eq ('api/default_avatar/avatar_neutre.svg')
  end

  it "revoie l'avatar Indéfini (sexe=nil)" do
    expect(@hmg.img_avatar( nil )).to eq ('api/default_avatar/avatar_neutre.svg')
  end
end
