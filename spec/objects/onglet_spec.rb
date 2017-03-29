require File.expand_path '../../spec_helper.rb', __FILE__

describe 'OngletTest' do
  before(:all) do
    @ids = BDD.ids_datas
  end

  it 'ajoute un nouvel onglet' do
    onglet = Onglet.new nil, @ids[:carnet1][:id], 'Histoire', 'VAA99001'
    onglet.create
    expect(onglet.id).not_to be_nil
    # on regarede si la liasin entre le carnet et l'onglet a été créé
    expect(CarnetOnglet[carnets_id: @ids[:carnet1][:id], onglets_id: onglet.id]).not_to be_nil
  end

  it 'id de carnet nil' do
    onglet = Onglet.new nil, nil, 'Histoire', 'VAA99001'
    expect { onglet.create }.to raise_error
  end

  it 'titre onglet nil' do
    onglet = Onglet.new nil, @ids[:carnet1][:id], nil, 'VAA99001'
    expect { onglet.create }.to raise_error(ArgumentError)
  end

  it 'adm onglet nil' do
    onglet = Onglet.new nil, @ids[:carnet1][:id], 'Histoire', nil
    expect { onglet.create }.to raise_error(ArgumentError)
  end

  it 'récupère un onglet' do
    onglet = Onglet.new @ids[:carnet1][:onglet1][:id]
    onglet.read
    expect(onglet.nom).to eq('Maths')
    expect(onglet.uid_own).to eq('VAA99001')
  end

  it "mis a jour de l'onglet" do
    onglet = Onglet.new @ids[:carnet1][:onglet1][:id], @ids[:carnet1][:id]
    onglet.update 'nouveau nom', 6, 'nouvelle url publique'
    expect(Onglet[id: @ids[:carnet1][:onglet1][:id]].nom).to eq('nouveau nom')
    expect(CarnetOnglet[carnets_id: @ids[:carnet1][:id], onglets_id: @ids[:carnet1][:onglet1][:id]].ordre).to eq(6)
    expect(Onglet[id: @ids[:carnet1][:onglet1][:id]].url_publique).to eq('nouvelle url publique')
  end

  it 'supprime un onglet' do
    onglet = Onglet.new @ids[:carnet1][:onglet1][:id], @ids[:carnet1][:id]
    onglet.delete
    expect(Onglet[id: @ids[:carnet1][:onglet1][:id]]).to be_nil
    expect(CarnetOnglet[carnets_id: @ids[:carnet1][:id], onglets_id: @ids[:carnet1][:onglet1][:id]]).to be_nil
  end

  it "supprime une url publique d'un carnet" do
    onglet = Onglet.new @ids[:carnet2][:onglet1][:id]
    onglet.delete_url
    expect(Onglet[id: @ids[:carnet2][:onglet1][:id]].url_publique).to be_nil
  end

  it "récupère les entrées de l'onglet" do
    onglet = Onglet.new @ids[:carnet2][:onglet1][:id], @ids[:carnet2][:id]
    entrees = onglet.entrees
    expect(entrees.size).to eq(2)
  end

  it "supprime les entrées de l'onglet" do
    onglet = Onglet.new @ids[:carnet2][:onglet1][:id]
    onglet.delete_entrees

    expect(Saisie[id: @ids[:carnet2][:onglet1][:saisie1][:id]]).to be_nil
    id1 = EntreesOnglet[saisies_id: @ids[:carnet2][:onglet1][:saisie1][:id], onglets_id: @ids[:carnet2][:onglet1][:id]]
    expect(id1).to be_nil

    expect(Saisie[id: @ids[:carnet2][:onglet1][:saisie2][:id]]).to be_nil
    id2 = EntreesOnglet[saisies_id: @ids[:carnet2][:onglet1][:saisie2][:id], onglets_id: @ids[:carnet2][:onglet1][:id]]
    expect(id2).to be_nil
  end
end
