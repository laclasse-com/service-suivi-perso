require File.expand_path '../../spec_helper.rb', __FILE__

describe 'RightTests' do
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

  it "met a jour les droits spécifiques d'un utilisateur 10000" do
    right = Right.new nil, 'VAA99001', nil, nil, @ids[:carnet1][:id]
    right.update 1, 0, 0, 0, 0
    expect(Droit[carnets_id: @ids[:carnet1][:id], uid: 'VAA99001'].read).to eq(1)
    expect(Droit[carnets_id: @ids[:carnet1][:id], uid: 'VAA99001'].write).to eq(0)
    expect(Droit[carnets_id: @ids[:carnet1][:id], uid: 'VAA99001'].admin).to eq(0)
    expect(Droit[carnets_id: @ids[:carnet1][:id], uid: 'VAA99001'].hopital).to be false
    expect(Droit[carnets_id: @ids[:carnet1][:id], uid: 'VAA99001'].evignal).to be false
  end

  it "met a jour les droits spécifiques d'un utilisateur 01000" do
    right = Right.new nil, 'VAA99001', nil, nil, @ids[:carnet1][:id]
    right.update 0, 1, 0, 0, 0
    expect(Droit[carnets_id: @ids[:carnet1][:id], uid: 'VAA99001'].read).to eq(0)
    expect(Droit[carnets_id: @ids[:carnet1][:id], uid: 'VAA99001'].write).to eq(1)
    expect(Droit[carnets_id: @ids[:carnet1][:id], uid: 'VAA99001'].admin).to eq(0)
    expect(Droit[carnets_id: @ids[:carnet1][:id], uid: 'VAA99001'].hopital).to be false
    expect(Droit[carnets_id: @ids[:carnet1][:id], uid: 'VAA99001'].evignal).to be false
  end

  it "met a jour les droits spécifiques d'un utilisateur 00100" do
    right = Right.new nil, 'VAA99001', nil, nil, @ids[:carnet1][:id]
    right.update 0, 0, 1, 0, 0
    expect(Droit[carnets_id: @ids[:carnet1][:id], uid: 'VAA99001'].read).to eq(0)
    expect(Droit[carnets_id: @ids[:carnet1][:id], uid: 'VAA99001'].write).to eq(0)
    expect(Droit[carnets_id: @ids[:carnet1][:id], uid: 'VAA99001'].admin).to eq(1)
    expect(Droit[carnets_id: @ids[:carnet1][:id], uid: 'VAA99001'].hopital).to be false
    expect(Droit[carnets_id: @ids[:carnet1][:id], uid: 'VAA99001'].evignal).to be false
  end

  it "met a jour les droits spécifiques d'un utilisateur 00010" do
    right = Right.new nil, 'VAA99001', nil, nil, @ids[:carnet1][:id]
    right.update 0, 0, 0, 1, 0
    expect(Droit[carnets_id: @ids[:carnet1][:id], uid: 'VAA99001'].read).to eq(0)
    expect(Droit[carnets_id: @ids[:carnet1][:id], uid: 'VAA99001'].write).to eq(0)
    expect(Droit[carnets_id: @ids[:carnet1][:id], uid: 'VAA99001'].admin).to eq(0)
    expect(Droit[carnets_id: @ids[:carnet1][:id], uid: 'VAA99001'].hopital).to be true
    expect(Droit[carnets_id: @ids[:carnet1][:id], uid: 'VAA99001'].evignal).to be false
  end

  it "met a jour les droits spécifiques d'un utilisateur 00001" do
    right = Right.new nil, 'VAA99001', nil, nil, @ids[:carnet1][:id]
    right.update 0, 0, 0, 0, 1
    expect(Droit[carnets_id: @ids[:carnet1][:id], uid: 'VAA99001'].read).to eq(0)
    expect(Droit[carnets_id: @ids[:carnet1][:id], uid: 'VAA99001'].write).to eq(0)
    expect(Droit[carnets_id: @ids[:carnet1][:id], uid: 'VAA99001'].admin).to eq(0)
    expect(Droit[carnets_id: @ids[:carnet1][:id], uid: 'VAA99001'].hopital).to be false
    expect(Droit[carnets_id: @ids[:carnet1][:id], uid: 'VAA99001'].evignal).to be true
  end

  it 'met a jour un droit inexistant en BDD' do
    right = Right.new nil, 'VZZ69999', nil, nil, @ids[:carnet1][:id]
    expect { right.update(1, 0, 0, 0, 0) }.to raise_error(ArgumentError)
  end

  it 'supprime un droit' do
    right = Right.new nil, 'VAA99001', nil, nil, @ids[:carnet1][:id]
    right.delete
    expect(Droit[carnets_id: @ids[:carnet1][:id], uid: 'VAA99001']).to be_nil
  end

  it 'supprime un droit inexistant en BDD' do
    right = Right.new nil, 'VZZ69999', nil, nil, @ids[:carnet1][:id]
    expect { right.delete }.to raise_error(ArgumentError)
  end

  it 'informe si le droit existe ou pas' do
    right = Right.new nil, 'VAA99001', nil, nil, @ids[:carnet1][:id]
    expect(right.exist?).to be true

    right = Right.new nil, 'VAA990089', nil, nil, @ids[:carnet1][:id]
    expect(right.exist?).to be false
  end
end
