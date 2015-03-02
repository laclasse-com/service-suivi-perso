require File.expand_path '../../spec_helper.rb', __FILE__

describe 'CarnetTest' do
  before(:all) do
    @ids = BDD::get_ids_datas
  end

  it "créé un carnet" do
    carnet = Carnet.new(nil, "VAA99094", "VAA99003", "666666K", 2)
    id = carnet.create
    expect(id.class).to be Fixnum
    expect(Carnets[:id => id]).not_to be_nil
  end

  it "créé un carnet pour un élève ayant déja un carnet" do
    carnet = Carnet.new(nil, "VAA99093", "VAA99003", "666666K", 2)
    expect{carnet.create}.to raise_error(RuntimeError)
  end

  it "Récupère un carnet à partir d'un id" do
    carnet = Carnet.new(@ids[:carnet1][:id])
    carnet.read
    expect(carnet.uid_elv).to eq("VAA99091")
    expect(carnet.uid_adm).to eq("VAA99001")
  end

  it "met a jour la colonne evignal et url pub du carnet" do
    carnet = Carnet.new(@ids[:carnet1][:id])
    carnet.update true, "nouvelle url pub"
    carnet.read
    expect(carnet.evignal).to be true
    expect(carnet.url_pub).to eq("nouvelle url pub")
  end

  it "supprime l'url publique d'un carnet" do
    carnet = Carnet.new(@ids[:carnet2][:id])
    carnet.deleteUrl
    expect(Carnets[:id => @ids[:carnet2][:id]].url_publique).to be_nil
  end

  it "retourne true si le carnet existe" do
    carnet = Carnet.new(@ids[:carnet2][:id])
    expect(carnet.exist?).to be true
  end

  it "retourne tous les onglets du carnet" do
    carnet = Carnet.new(@ids[:carnet2][:id])
    onglets = carnet.get_onglets
    expect(onglets.size).to eq(2)
  end

  it "retourne les entrees du carnets" do
    carnet = Carnet.new(@ids[:carnet2][:id])
    entrees = carnet.get_entrees
    expect(entrees.size).to eq(2)
  end

  it "retourne les droits specifiques au carnet" do
    carnet = Carnet.new(@ids[:carnet2][:id])
    rights = carnet.get_rights -1
    expect(rights.size).to eq(3)
  end

  it "retourne les droits spécifiques de evignal du carnet" do
    carnet = Carnet.new(@ids[:carnet2][:id])
    rights = carnet.get_rights 1
    expect(rights.size).to eq(0)
  end

  it "retourne les droits des personnes qui sont soit a l'hopital soit d'elivignal ou des deux" do
    carnet = Carnet.new(@ids[:carnet1][:id])
    rights = carnet.get_pers_evignal_or_hopital true, true
    expect(rights.size).to eq(0)
    rights = carnet.get_pers_evignal_or_hopital true, false
    expect(rights.size).to eq(2)
  end
end