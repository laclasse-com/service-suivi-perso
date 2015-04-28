require File.expand_path '../../spec_helper.rb', __FILE__

describe 'Test de la classe de gestion des droits' do
  before(:all) do
    @ids = BDD.ids_datas
  end

  it 'ajout un droit spécifique a un utilisateur' do
    right = Right.new nil, 'VAA99004', "Thomas M&M's", 'directeur', @ids[:carnet1][:id], 1, 1, 1, 1, 1
    right.create
    expect(right.id).not_to be_nil
  end

  it 'récupère un droit spécifique' do
    right = Right.new nil, 'VAA99001', nil, nil, @ids[:carnet1][:id]
    right.select
    expect(right.id).not_to be_nil
    expect(right.full_name).to eq('Jean Snickers')
    expect(right.admin).to eq(1)
  end

  it "met a jour les droits spécifique d'un utilisateur" do
    right = Right.new nil, 'VAA99001', nil, nil, @ids[:carnet1][:id]
    right.update 1, 1, 1, 1, 1
    expect(DroitsSpecifiques[carnets_id: @ids[:carnet1][:id], uid: 'VAA99001'].read).to eq(1)
    expect(DroitsSpecifiques[carnets_id: @ids[:carnet1][:id], uid: 'VAA99001'].write).to eq(1)
    expect(DroitsSpecifiques[carnets_id: @ids[:carnet1][:id], uid: 'VAA99001'].admin).to eq(1)
    expect(DroitsSpecifiques[carnets_id: @ids[:carnet1][:id], uid: 'VAA99001'].hopital).to be true
    expect(DroitsSpecifiques[carnets_id: @ids[:carnet1][:id], uid: 'VAA99001'].evignal).to be true
  end

  it 'supprime un droit' do
    right = Right.new nil, 'VAA99001', nil, nil, @ids[:carnet1][:id]
    right.delete
    expect(DroitsSpecifiques[carnets_id: @ids[:carnet1][:id], uid: 'VAA99001']).to be_nil
  end

  it 'informe si le droit existe ou pas' do
    right = Right.new nil, 'VAA99001', nil, nil, @ids[:carnet1][:id]
    expect(right.exist?).to be true

    right = Right.new nil, 'VAA990089', nil, nil, @ids[:carnet1][:id]
    expect(right.exist?).to be false
  end
end
