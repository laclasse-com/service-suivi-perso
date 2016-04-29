require File.expand_path '../../spec_helper.rb', __FILE__

describe 'OutilsTest' do
  include Outils
  it 'retourne une raise error si le parametre est manquant' do
    expect { requires({param: nil}, :param) }.to raise_error(ArgumentError)
  end

  it 'retourne une raise error si le parametre param ne devrait pas être vide' do
    expect { requires({param: []}, :param, :not_empty) }.to raise_error(ArgumentError)
  end

  it 'retourne une raise error si lLe parametre param ne devrait pas être vrai' do
    expect { requires({param: true}, :param, :true) }.to raise_error(ArgumentError)
  end

  it 'retourne une raise error si le parametre param ne devrait pas être faux' do
    expect { requires({param: false}, :param, :false) }.to raise_error(ArgumentError)
  end

  it 'retourne une raise error si le paramètre est nil' do
    expect(requires({param: true}, :param, :false)).to be_nil
  end

  it "retourne l'année scolaire en cours en chaine de caracteres" do
    expect(Outils.annee_scolaire_string.class).to be String
  end

  it "retourne le md5 d'une chaine" do
    expect(Outils.md5_encode('message')).to eq('78e731027d8fd50ed642340b7c9a63b3')
  end
end
