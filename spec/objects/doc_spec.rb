require File.expand_path '../../spec_helper.rb', __FILE__

describe 'DocTest' do
  before(:all) do
    @ids = BDD::get_ids_datas
  end

  it "ajoute doc dans la BDD" do
    doc = Doc.new nil, "nouveau doc.txt", "66666md54444", @ids[:carnet1][:onglet1][:saisie2][:id]
    doc.create
    expect(doc.id).not_to be_nil
  end

  it "récupère un doc de la BDD" do
    doc = Doc.new @ids[:carnet1][:onglet1][:saisie1][:doc1][:id]
    doc.read
    expect(doc.id).not_to be_nil
    expect(doc.nom).to eq("devoir_toto.doc")
  end

  it "met a jour le nom du document ou son md5" do
    doc = Doc.new @ids[:carnet1][:onglet1][:saisie1][:doc1][:id]
    doc.update "nouveau nom.txt", "nouveau md5"
    expect(Docs[:id => @ids[:carnet1][:onglet1][:saisie1][:doc1][:id]].nom).to eq("nouveau nom.txt")
    expect(Docs[:id => @ids[:carnet1][:onglet1][:saisie1][:doc1][:id]].url).to eq("nouveau md5")
  end

  it "supprime un document" do
    doc = Doc.new @ids[:carnet1][:onglet1][:saisie1][:doc1][:id]
    doc.delete
    expect(Docs[:id => @ids[:carnet1][:onglet1][:saisie1][:doc1][:id]]).to be_nil
  end
end