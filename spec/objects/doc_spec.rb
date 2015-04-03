require File.expand_path '../../spec_helper.rb', __FILE__

describe 'DocTest' do
  before(:all) do
    @ids = BDD.ids_datas
  end

  it "ajoute doc dans la BDD" do
    doc = Doc.new nil, "nouveau doc.txt", "66666md54444", @ids[:carnet1][:onglet1][:saisie2][:id]
    doc.create
    expect(doc.id).not_to be_nil
  end

  it 'create lance une exception car le titre du doc est nul' do
    doc = Doc.new nil, nil, '66666md54444', @ids[:carnet1][:onglet1][:saisie2][:id]
    -> { doc.create }.should raise_error
  end

  it 'create lance une exception car l url du doc est nulle' do
    doc = Doc.new nil, 'Nouveau cod2.txt', nil, @ids[:carnet1][:onglet1][:saisie2][:id]
    -> { doc.create }.should raise_error
  end

  it 'create renvoie une exception ArgumentError, saisie_id est nulle' do
    doc = Doc.new nil, 'nouveau doc.txt', '66666md54444', nil
    -> { doc.create }.should raise_error
  end

  it 'create renvoie une exception ArgumentError, le titre du doc est nul' do
    doc = Doc.new nil, nil, '66666md54444', @ids[:carnet1][:onglet1][:saisie2][:id]
    -> { doc.create }.should raise_error(ArgumentError)
  end

  it 'create renvoie une exception ArgumentError, l url du doc est nulle' do
    doc = Doc.new nil, 'Nouveau cod2.txt', nil, @ids[:carnet1][:onglet1][:saisie2][:id]
    -> { doc.create }.should raise_error(ArgumentError)
  end

  it 'create renvoie une exception ArgumentError, saisie_id du doc est nul' do
    doc = Doc.new nil, 'nouveau doc.txt', '66666md54444', nil
    -> { doc.create }.should raise_error(ArgumentError)
  end

  # Methode 'read'
  it 'read récupère un doc de la BDD' do
=======
  it "récupère un doc de la BDD" do
>>>>>>> 49090ea... refactoring Doc class : simplifying.
    doc = Doc.new @ids[:carnet1][:onglet1][:saisie1][:doc1][:id]
    doc.read
    expect(doc.id).not_to be_nil
    expect(doc.nom).to eq('devoir_toto.doc')
  end

  it 'read renvoie une exception ArgumentError car id du doc nul' do
    doc = Doc.new nil
    -> { doc.read }.should raise_error(ArgumentError)
  end

  it 'read renvoie une exception ArgumentError car id du doc inexistant dans la bdd' do
    doc = Doc.new 9_999_999
    -> { doc.read }.should raise_error(ArgumentError)
  end

  # methode 'update'
  it 'update met a jour le nom du document ou son md5' do
    doc = Doc.new @ids[:carnet1][:onglet1][:saisie1][:doc1][:id]
    doc.update 'nouveau nom.txt', 'nouveau md5'
    expect(Docs[id: @ids[:carnet1][:onglet1][:saisie1][:doc1][:id]].nom).to eq('nouveau nom.txt')
    expect(Docs[id: @ids[:carnet1][:onglet1][:saisie1][:doc1][:id]].url).to eq('nouveau md5')
  end

  it 'update avec nom nul, ne fait rien' do
    doc = Doc.new @ids[:carnet1][:onglet1][:saisie1][:doc1][:id]
    -> { doc.update nil, 'nouveau md5' }.should_not raise_error(ArgumentError)
    expect(Docs[id: @ids[:carnet1][:onglet1][:saisie1][:doc1][:id]].nom).to eq('devoir_toto.doc')
  end

  it 'update md5 nul, ne fait rien' do
    doc = Doc.new @ids[:carnet1][:onglet1][:saisie1][:doc1][:id]
    -> { doc.update 'nouveau nom.txt', nil }.should_not raise_error(ArgumentError)
    expect(Docs[id: @ids[:carnet1][:onglet1][:saisie1][:doc1][:id]].url).to eq('987md5432')
  end

  # methode 'delete'
  it 'delete supprime un document' do
    doc = Doc.new @ids[:carnet1][:onglet1][:saisie1][:doc1][:id]
    doc.delete
    expect(Docs[id: @ids[:carnet1][:onglet1][:saisie1][:doc1][:id]]).to be_nil
  end

  it 'delete renvoie une exception ArgumentError car id du doc nul' do
    doc = Doc.new nil
    -> { doc.delete }.should raise_error(ArgumentError)
  end

  it 'delete renvoie une exception ArgumentError car id du doc inexistant dans la bdd' do
    doc = Doc.new 9_999_999
    -> { doc.delete }.should raise_error(ArgumentError)
  end
end
