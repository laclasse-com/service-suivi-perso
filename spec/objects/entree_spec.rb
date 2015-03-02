require File.expand_path '../../spec_helper.rb', __FILE__

describe 'EntreeTest' do
  before(:all) do
    @ids = BDD::get_ids_datas
  end

  it "ajoute une entree a l'onglet d'un carnet" do
    entree = Entree.new nil, @ids[:carnet1][:onglet1][:id], @ids[:carnet1][:id], "VAA99091", AVATAR[:M], "rgba(235,84,84,0.7)", "rgba(232,194,84,0.3)", "Patrick Chocobon - Elève - CLG E-Vignal", "Et Toto reste toujours poli"
    entree.create
    expect(entree.id).not_to be_nil
  end

  it "récupère une entrée" do
    entree = Entree.new @ids[:carnet1][:onglet1][:saisie1][:id]
    entree.read
    expect(entree.uid).to eq("VAA99001")
    expect(entree.contenu).to eq("<strong>Toto</strong> est un petit garçon")
  end

  it "mise à jour de l'avatar ou du contenu de l'entrée" do
    entree = Entree.new @ids[:carnet1][:onglet1][:saisie1][:id]
    entree.update "nouveau contenu", "nouvel avatar"
    expect(Saisies[:id => @ids[:carnet1][:onglet1][:saisie1][:id]].contenu).to eq("nouveau contenu")
    expect(Saisies[:id => @ids[:carnet1][:onglet1][:saisie1][:id]].avatar).to eq("nouvel avatar")
  end

  it "supprime une entree" do 
    entree = Entree.new @ids[:carnet1][:onglet1][:saisie1][:id], @ids[:carnet1][:onglet1][:id]
    entree.delete
    expect(Saisies[:id => @ids[:carnet1][:onglet1][:saisie1][:id]]).to be_nil
  end

  it "mis a jour de tous les avatars des entrées d'un utilisateur" do
    entree = Entree.new nil, nil, nil, "VAA99001"
    entree.update_avatar "nouvel avatar"
    expect(Saisies[:id => @ids[:carnet1][:onglet1][:saisie1][:id]].avatar).to eq("nouvel avatar")
  end

  it "supprime un doc d'une entrée" do
    entree = Entree.new @ids[:carnet1][:onglet1][:saisie1][:id]
    entree.delete_docs
    expect(Docs[:id => @ids[:carnet1][:onglet1][:saisie1][:doc1][:id]]).to be_nil
  end

  it "récupère les documents d'une entrée" do
    entree = Entree.new @ids[:carnet1][:onglet1][:saisie1][:id]
    docs = entree.get_docs
    expect(docs.size).to eq(1)
  end
end