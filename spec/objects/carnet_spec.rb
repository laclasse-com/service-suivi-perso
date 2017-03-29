# coding: utf-8
require File.expand_path '../../spec_helper.rb', __FILE__

describe 'CarnetObject.est' do
  before(:all) do
    @ids = BDD.ids_datas
  end

  it 'créer un carnet' do
    carnet = CarnetObject.new(nil, 'VAA99094', 'VAA99003', '666666K', 2)
    id = carnet.create
    expect(id.class).to be Fixnum
    expect(CarnetObject.odel[id: id]).not_to be_nil
  end

  it 'créer un carnet pour un élève ayant déja un carnet' do
    carnet = CarnetObject.new(nil, 'VAA99093', 'VAA99003', '666666K', 2)
    expect { carnet.create }.to raise_error(CrudError)
  end

  it 'créer un carnet pour un élève avec uid nil' do
    carnet = CarnetObject.new(nil, nil, 'VAA99003', '666666K', 2)
    expect { carnet.create }.to raise_error(ArgumentError)
  end

  it 'créer un carnet pour un élève avec adm_id nil' do
    carnet = CarnetObject.new(nil, 'VAA99093', nil, '666666K', 2)
    expect { carnet.create }.to raise_error(ArgumentError)
  end

  it 'créer un carnet pour un élève aavec uai nil' do
    carnet = CarnetObject.new(nil, 'VAA99093', 'VAA99003', nil, 2)
    expect { carnet.create }.to raise_error(ArgumentError)
  end

  it 'créer un carnet pour un élève avec classe nil' do
    carnet = CarnetObject.new(nil, 'VAA99093', 'VAA99003', '666666K', nil)
    expect { carnet.create }.to raise_error(ArgumentError)
  end

  # Pour ce test, il faut mocker l'annuaire
  # qui doit renvoyer pour ce cas précis : {"error"=>"Introuvable: l'utilisateur n'existe pas"}
  # mais qui doit être OK pour tous les autres cas de test :/

  # it 'créer un carnet pour un élève inexistant' do
  #   carnet = CarnetObject.new(nil, 'VZZ69999', 'VAA99003', '666666K', 2)
  #   expect { carnet.create }.to raise_error(RuntimeError)
  # end

  it "Récupère un carnet à partir d'un id" do
    carnet = CarnetObject.new(@ids[:carnet1][:id])
    carnet.read
    expect(carnet.uid_elv).to eq('VAA99091')
    expect(carnet.uid_adm).to eq('VAA99001')
  end

  it "Récupère un carnet à partir d'un id nil" do
    carnet = CarnetObject.new(nil)
    expect { carnet.read }.to raise_error(CrudError)
  end

  it "Récupère un carnet à partir d'un id inexistant" do
    carnet = CarnetObject.new(999_999)
    expect { carnet.read }.to raise_error(CrudError)
  end

  it 'met a jour la colonne evignal et url pub du carnet' do
    carnet = CarnetObject.new(@ids[:carnet1][:id])
    carnet.update true, 'nouvelle url pub'
    carnet.read
    expect(carnet.evignal).to be true
    expect(carnet.url_pub).to eq('nouvelle url pub')
  end

  it "met a jour la colonne evignal et url pub d'un carnet inexistant" do
    carnet = CarnetObject.new(999_999)
    expect { carnet.update true, 'nouvelle url pub' }.to raise_error(CrudError)
  end

  it "supprime l'url publique d'un carnet" do
    carnet = CarnetObject.new(@ids[:carnet2][:id])
    carnet.delete_url
    expect(CarnetObject.odel[id: @ids[:carnet2][:id]].url_publique).to be_nil
  end

  it "Suppression de l'url publique d'un carnet : id nil, doit lancer une exception" do
    carnet = CarnetObject.new(nil)
    expect { carnet.delete_url }.to raise_error(CrudError)
  end

  it 'retourne true si le carnet existe' do
    carnet = CarnetObject.new(@ids[:carnet2][:id])
    expect(carnet.exist?).to be true
  end

  it "renvoie false le carnet n'existe pas" do
    carnet = CarnetObject.new(nil)
    expect(carnet.exist?).to be false
  end

  it "renvoie false si le carnet n'existe pas" do
    carnet = CarnetObject.new(999_999)
    expect(carnet.exist?).to be false
  end

  it 'retourne tous les onglets du carnet' do
    carnet = CarnetObject.new(@ids[:carnet2][:id])
    onglets = carnet.onglets
    expect(onglets.size).to eq(2)
  end

  it 'onglets lance une exception si id manquant' do
    carnet = CarnetObject.new
    expect { carnet.onglets }.to raise_error(ArgumentError)
  end

  it 'retourne les entrees du carnets' do
    carnet = CarnetObject.new(@ids[:carnet2][:id])
    entrees = carnet.entrees
    expect(entrees.size).to eq(2)
  end

  it 'entrees lance une exception si id manquant' do
    carnet = CarnetObject.new
    expect { carnet.entrees }.to raise_error(ArgumentError)
  end

  it 'retourne les droits specifiques au carnet' do
    carnet = CarnetObject.new(@ids[:carnet2][:id])
    rights = carnet.get_rights(-1)
    expect(rights.size).to eq(3)
  end

  it 'get_rights lance une exception si id manquant' do
    carnet = CarnetObject.new
    expect { carnet.get_rights }.to raise_error(ArgumentError)
  end

  it 'retourne les droits spécifiques de evignal du carnet' do
    carnet = CarnetObject.new(@ids[:carnet2][:id])
    rights = carnet.get_rights 1
    expect(rights.size).to eq(0)
  end

  it "retourne les droits des personnes qui sont soit a l'hopital soit d'elivignal ou des deux" do
    carnet = CarnetObject.new(@ids[:carnet1][:id])
    rights = carnet.get_pers_evignal_or_hopital true, true
    expect(rights.size).to eq(0)
    rights = carnet.get_pers_evignal_or_hopital true, false
    expect(rights.size).to eq(2)
  end

  it 'get_pers_evignal_or_hopital lance une exception si id manquant' do
    carnet = CarnetObject.new
    expect { carnet.get_pers_evignal_or_hopital }.to raise_error(ArgumentError)
  end
end
