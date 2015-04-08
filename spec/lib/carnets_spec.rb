require File.expand_path '../../spec_helper.rb', __FILE__

describe 'CarnetsLibTest' do
  include CarnetsLib

  before(:all) do
    @ids = BDD.get_ids_datas
  end

  it "retourne les carnets par rapport à la réponse de l'annuaire d'un user" do
    carnets = search_carnets_of SEARCH_USER, true
    expect(carnets.size).to eq(1)
    expect(carnets[0][:id]).to eq(@ids[:carnet1][:id])
    expect(carnets[0][:uid_elv]).to eq('VAA99091')
    expect(carnets[0][:firstName]).to eq('Patrick')
    expect(carnets[0][:lastName]).to eq('Chocobon')
    expect(carnets[0][:classe_id]).to eq(1)
    expect(carnets[0][:etablissement_code]).to eq('999999K')
  end

  it 'récupère les onglets avec les messages du carnet' do
    tabs = get_tabs 'VAA99091'
    expect(tabs.size).to eq(1)
    expect(tabs[0][:id]).to eq(@ids[:carnet1][:onglet1][:id])
    expect(tabs[0][:nom]).to eq('Maths')
    expect(tabs[0][:entrees].size).to eq(2)
    expect([@ids[:carnet1][:onglet1][:saisie1][:id], @ids[:carnet1][:onglet1][:saisie2][:id]].include?(tabs[0][:entrees][0][:id])).to be true
    expect([@ids[:carnet1][:onglet1][:saisie1][:id], @ids[:carnet1][:onglet1][:saisie2][:id]].include?(tabs[0][:entrees][1][:id])).to be true
  end

  it "créé les mêmes onglets d'un ancien carnet sur un nouveau" do
    old_carnet = Carnet.new @ids[:carnet1][:id]
    old_carnet.read
    new_carnet =  Carnet.new nil, 'VAA99095', 'VAA99001', '999999K', 1
    new_carnet.create

    last_carnet_model old_carnet, new_carnet
    nb_onglets = CarnetsOnglets.where(carnets_id: new_carnet.id).count
    expect(nb_onglets).to eq(1)
    CarnetsOnglets.where(carnets_id: new_carnet.id).each do |o|
      expect(Onglets[id: o.onglets_id].nom).to eq('Maths')
      expect(o.ordre).to eq(1)
    end
  end

  it 'test mock' do
    reponse_mock = [MOCK_USERS_LISTE[3]]
    Laclasse::CrossApp::Sender.should_receive(:send_request_signed).with(:service_annuaire_user, ANNUAIRE_URL[:user_liste] + 'VAA99091', {}).and_return(reponse_mock)
    carnets = get_evignal_carnets
    expect(carnets.size).to eq(1)
  end
end
