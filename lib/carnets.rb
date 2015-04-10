# coding: utf-8
# Module de fonctions liées aux carnets
module CarnetsLib
  module_function

  include AuthenticationHelpers

  def search_carnets_of(response_annuaire, evignal = false)
    carnets = []
    response_annuaire.each do |reponse|
      carnet = Carnet.new(nil, reponse['id_ent'])
      carnet.read if carnet.exist?
      if evignal
        etablissement_nom = reponse['classes'][0]['etablissement_nom']
        !carnet.id.nil? && carnet.evignal == true ? active = true : active = false
      else
        etablissement_nom = nil
        !carnet.id.nil? ? active = true : active = false
      end
      carnets.push(  		id: carnet.id,
                       couleur: nil,
                       uid_elv: reponse['id_ent'],
                       firstName: reponse['prenom'],
                       lastName: reponse['nom'],
                       classe: reponse['classes'][0]['classe_libelle'],
                       classe_id: reponse['classes'][0]['classe_id'],
                       etablissement_code: reponse['classes'][0]['etablissement_code'],
                       etablissement_nom: etablissement_nom,
                       avatar: reponse['avatar'],
                       active: active)
    end
    carnets
  end

  def get_carnets_by_classe_of(response_annuaire)
    carnets = {classe: {}, carnets: []}
    # info sur la classe
    classe = {
      id: response_annuaire['id'],
      couleur: nil,
      name: response_annuaire['libelle_aaf'],
      college: response_annuaire['etablissement']['nom'],
      collegeId: response_annuaire['etablissement']['id'],
      college_code: response_annuaire['etablissement']['code_uai']
    }
    carnets[:classe] = classe
    response_annuaire['eleves'].each do |reponse|
      # puts reponse['avatar'].inspect
      carnet = Carnet.new(nil, reponse['id_ent'])
      if carnet.exist?
        carnet.read
        carnets[:carnets].push(	  			id: carnet.id,
                                     couleur: nil,
                                     uid_elv: reponse['id_ent'],
                                     firstName: reponse['prenom'],
                                     lastName: reponse['nom'],
                                     classe: response_annuaire['libelle_aaf'],
                                     classe_id: response_annuaire['id'],
                                     etablissement_code: response_annuaire['etablissement']['code_uai'],
                                     avatar: reponse['avatar'],
                                     active: !carnet.id.nil?)
      end
    end
    carnets
  end

  def get_evignal_carnets
    carnets = []
    uids = []
    Carnets.where(evignal: true).each do |carnet|
      uids.push carnet.uid_elv
      carnets.push(        id: carnet.id,
                           couleur: nil,
                           uid_elv: carnet.uid_elv,
                           firstName: nil,
                           lastName: nil,
                           classe: nil,
                           classe_id: carnet.cls_id,
                           etablissement_code: carnet.uai,
                           avatar: nil)
    end
    response = []
    # puts ANNUAIRE_URL[:user_liste] + uids.join("_").to_s
    response = Laclasse::CrossApp::Sender.send_request_signed(:service_annuaire_user, ANNUAIRE_URL[:user_liste] + uids.join('_').to_s, {}) unless uids.empty?
    # puts "la reponse de l'annuaire => "+response.inspect
    response.each do |user|
      carnets.each do |carnet|
        if carnet[:uid_elv] == user['id_ent']
          carnet[:firstName] = user['prenom']
          carnet[:lastName] = user['nom']
          carnet[:avatar] = user['avatar']
        end
      end
    end
    carnets
  end

  def get_tabs(uid_elv, id_onglets = nil, url_pub = nil)
    onglets = []
    carnet = Carnet.new(nil, uid_elv)
    carnet.read
    carnet.get_onglets.each do |tab|
      if (id_onglets.nil? || id_onglets.include?(tab.id)) && (url_pub.nil? || url_pub == tab.url_pub)
        entrees = []
        tab.get_entrees.each do |e|
          entrees.push ({
            id: e.id,
            owner: {
              uid: e.uid,
              infos: e.infos_owner,
              avatar: e.avatar,
              avatar_color: e.avatar_color,
              back_color: e.back_color
            },
            contenu: e.contenu,
            docs: e.get_docs,
            date: e.date_modification
          })
        end
        onglets.push ({
          id: tab.id,
          carnet_id: tab.id_carnet,
          nom: tab.nom,
          owner: tab.uid_own,
          ordre: tab.ordre,
          editable: false,
          active: tab.ordre == 1,
          htmlcontent: '',
          modifEntree: nil,
          entrees: entrees
        })
      end
    end
    onglets.sort_by { |o| o[:ordre] }
  end

  def last_carnet_model(old_carnet, new_carnet)
    # récupérer ses onglets
    old_onglets = old_carnet.get_onglets
    # créer les nouveaux onglets par rapport a ceux du dernier carnet
    old_onglets.each do |old_onglet|
      new_onglet = Onglet.new(nil, new_carnet.id, old_onglet.nom, new_carnet.uid_adm, old_onglet.ordre)
      new_onglet.create
    end
  end
end
