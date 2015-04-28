require File.expand_path '../../spec_helper.rb', __FILE__

describe 'EntreeTest' do
  before(:all) do
    @ids = BDD.ids_datas
  end

  it "ajoute une entree à l'onglet d'un carnet" do
    entree = Entree.new nil, @ids[:carnet1][:onglet1][:id], @ids[:carnet1][:id], 'VAA99091', AVATAR[:M], 'rgba(235,84,84,0.7)', 'rgba(232,194,84,0.3)', 'Patrick Chocobon - Elève - CLG E-Vignal', 'Et Toto reste toujours poli'
    entree.create
    expect(entree.id).not_to be_nil
  end

  it "n'ajoute pas d'entree à l'onglet d'un carnet car id onglet nil : ArgumentError" do
    entree = Entree.new nil, nil, @ids[:carnet1][:id], 'VAA99091', AVATAR[:M], 'rgba(235,84,84,0.7)', 'rgba(232,194,84,0.3)', 'Patrick Chocobon - Elève - CLG E-Vignal', 'Et Toto reste toujours poli'
    expect { entree.create }.to raise_error(ArgumentError)
  end

  it "n'ajoute pas d'entree à l'onglet d'un carnet car id carnet nil : ArgumentError" do
    entree = Entree.new nil, @ids[:carnet1][:onglet1][:id], nil, 'VAA99091', AVATAR[:M], 'rgba(235,84,84,0.7)', 'rgba(232,194,84,0.3)', 'Patrick Chocobon - Elève - CLG E-Vignal', 'Et Toto reste toujours poli'
    expect { entree.create }.to raise_error(ArgumentError)
  end

  it "n'ajoute pas d'entree à l'onglet d'un carnet car id Admin nil : ArgumentError" do
    entree = Entree.new nil, @ids[:carnet1][:onglet1][:id], @ids[:carnet1][:id], nil, AVATAR[:M], 'rgba(235,84,84,0.7)', 'rgba(232,194,84,0.3)', 'Patrick Chocobon - Elève - CLG E-Vignal', 'Et Toto reste toujours poli'
    expect { entree.create }.to raise_error(ArgumentError)
  end

  it "n'ajoute pas d'entree à l'onglet d'un carnet car infos_owner nil : ArgumentError" do
    entree = Entree.new nil, @ids[:carnet1][:onglet1][:id], @ids[:carnet1][:id], nil, AVATAR[:M], 'rgba(235,84,84,0.7)', 'rgba(232,194,84,0.3)', nil, 'Et Toto reste toujours poli'
    expect { entree.create }.to raise_error(ArgumentError)
  end

  it "n'ajoute pas d'entree à l'onglet d'un carnet car contenu nil : ArgumentError" do
    entree = Entree.new nil, @ids[:carnet1][:onglet1][:id], @ids[:carnet1][:id], nil, AVATAR[:M], 'rgba(235,84,84,0.7)', 'rgba(232,194,84,0.3)', 'Patrick Chocobon - Elève - CLG E-Vignal', nil
    expect { entree.create }.to raise_error(ArgumentError)
  end

  it 'récupère une entrée' do
    entree = Entree.new @ids[:carnet1][:onglet1][:saisie1][:id]
    entree.read
    expect(entree.uid).to eq('VAA99001')
    expect(entree.contenu).to eq('<strong>Toto</strong> est un petit garçon')
  end

  it 'ne récupère aucune entrée car id nul' do
    entree = Entree.new nil
    expect { entree.read }.to raise_error(ArgumentError)
  end

  it 'ne récupère aucune entrée car id inexistant' do
    entree = Entree.new 999_999
    expect { entree.read }.to raise_error(ArgumentError)
  end

  it "mise à jour de l'avatar ou du contenu de l'entrée" do
    entree = Entree.new @ids[:carnet1][:onglet1][:saisie1][:id]
    entree.update 'nouveau contenu', 'nouvel avatar'
    expect(Saisies[id: @ids[:carnet1][:onglet1][:saisie1][:id]].contenu).to eq('nouveau contenu')
    expect(Saisies[id: @ids[:carnet1][:onglet1][:saisie1][:id]].avatar).to eq('nouvel avatar')
  end

  it "pas de mise à jour du contenu de l'entrée, car il est nul" do
    entree = Entree.new @ids[:carnet1][:onglet1][:saisie1][:id]
    entree.update 'nouveau contenu', 'nouvel avatar'
    entree.update nil, 'nouvel avatar'
    expect(Saisies[id: @ids[:carnet1][:onglet1][:saisie1][:id]].contenu).to eq('nouveau contenu')
  end

  it "pas de mise à jour de l'avatar de l'entrée, car il est nul" do
    entree = Entree.new @ids[:carnet1][:onglet1][:saisie1][:id]
    entree.update 'nouveau contenu', nil
    expect(Saisies[id: @ids[:carnet1][:onglet1][:saisie1][:id]].avatar).to eq('url_avatar')
  end

  it 'supprime une entree' do
    entree = Entree.new @ids[:carnet1][:onglet1][:saisie1][:id], @ids[:carnet1][:onglet1][:id]
    entree.delete
    expect(Saisies[id: @ids[:carnet1][:onglet1][:saisie1][:id]]).to be_nil
  end

  it 'Lance une exception car saisie_id nul' do
    entree = Entree.new nil, @ids[:carnet1][:onglet1][:id]
    expect { entree.delete }.to raise_error(ArgumentError)
    expect(Saisies[id: @ids[:carnet1][:onglet1][:saisie1][:id]].id).to eq(@ids[:carnet1][:onglet1][:saisie1][:id])
  end

  it "mis a jour de tous les avatars des entrées d'un utilisateur" do
    entree = Entree.new nil, nil, nil, 'VAA99001'
    entree.update_avatar 'nouvel avatar'
    expect(Saisies[id: @ids[:carnet1][:onglet1][:saisie1][:id]].avatar).to eq('nouvel avatar')
  end

  it 'pas de mise à jour de tous les avatars des entrées, car il est nul' do
    entree = Entree.new nil, nil, nil, nil
    expect { entree.update_avatar nil }.to raise_error(ArgumentError)
  end

  it "supprime un doc d'une entrée" do
    entree = Entree.new @ids[:carnet1][:onglet1][:saisie1][:id]
    entree.delete_docs
    expect(Docs[id: @ids[:carnet1][:onglet1][:saisie1][:doc1][:id]]).to be_nil
  end

  it "récupère les documents d'une entrée" do
    entree = Entree.new @ids[:carnet1][:onglet1][:saisie1][:id]
    docs = entree.get_docs
    expect(docs.size).to eq(1)
  end
end
