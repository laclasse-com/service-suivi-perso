require File.expand_path '../../spec_helper.rb', __FILE__

describe 'OutilsTest' do
  include Outils
  it "retourne une raise error si le parametre n'est pas le bon attendu" do
    expect { requires({param: nil}, :param) }.to raise_error(ArgumentError)
    expect { requires({param: []}, :param, :not_empty) }.to raise_error(ArgumentError)
    expect { requires({param: true}, :param, :true) }.to raise_error(ArgumentError)
    expect { requires({param: false}, :param, :false) }.to raise_error(ArgumentError)
    expect(requires({param: true}, :param, :false)).to be_nil
  end

  it "retourne l'année scolaire en cours en chaine de caracteres" do
    expect(Outils.annee_scolaire_string.class).to be String
  end

  it "retourne le md5 d'une chaine" do
    expect(Outils.md5_encode 'message').to eq('78e731027d8fd50ed642340b7c9a63b3')
  end
end
