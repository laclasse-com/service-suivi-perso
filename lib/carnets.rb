# coding: utf-8
# Module de fonctions liées aux carnets

# rubocop:disable Metrics/ModuleLength
module CarnetsLib
  module_function

  include URLHelpers

  def search_carnets_of( eleves, evignal = false )
    eleves.map do |eleve|
      carnet = Carnet[uid_elv: eleve['id_ent']]
      next if carnet.nil?

      { id: carnet.id,
        couleur: nil,
        uid_elv: eleve['id_ent'],
        firstName: eleve['prenom'],
        lastName: eleve['nom'],
        classe: eleve['classes'][0]['classe_libelle'],
        classe_id: eleve['classes'][0]['classe_id'],
        etablissement_code: eleve['classes'][0]['etablissement_code'],
        etablissement_nom: evignal ? eleve['classes'][0]['etablissement_nom'] : nil,
        avatar: eleve['avatar'],
        active: evignal ? !carnet.id.nil? && carnet.evignal : !carnet.id.nil? }
    end
                     .compact
  end

  # def carnets_evignal
  #   carnets = []
  #   uids = []

  #   Carnet.where(evignal: true).each do |carnet|
  #     uids.push carnet.uid_elv
  #     carnets.push(
  #       id: carnet.id,
  #       couleur: nil,
  #       uid_elv: carnet.uid_elv,
  #       firstName: nil,
  #       lastName: nil,
  #       classe: nil,
  #       classe_id: carnet.cls_id,
  #       etablissement_code: carnet.uai,
  #       avatar: nil
  #     )
  #   end

  #   return [] if uids.empty?

  #   response = Laclasse::CrossApp::Sender.send_request_signed(:service_annuaire_user, "liste/#{uids.join('_')}", {})
  #   return [] unless response.is_a? Array

  #   response.each do |user|
  #     carnets.each do |carnet|
  #       if carnet[:uid_elv] == user['id_ent']
  #         carnet[:firstName] = user['prenom']
  #         carnet[:lastName] = user['nom']
  #         carnet[:avatar] = user['avatar']
  #       end
  #     end
  #   end

  #   carnets
  # end

  def tab_list(uid_elv, id_onglets = nil, url_pub = nil)
    onglets = []
    carnet = Carnet[uid_elv: uid_elv]

    carnet.onglets.each do |tab|
      if (id_onglets.nil? || id_onglets.include?(tab.id)) && (url_pub.nil? || url_pub == tab.url_pub)
        entrees = []
        tab.entrees.each do |e|
          entrees.push(
            id: e.id,
            owner: {
              uid: e.uid,
              infos: e.infos_owner,
              avatar: e.avatar,
              avatar_color: e.avatar_color,
              back_color: e.back_color
            },
            contenu: e.contenu,
            docs: e.docs_attaches,
            date: e.date_modification)
        end
        onglets.push(
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
        )
      end
    end
    onglets.sort_by { |o| o[:ordre] }
  end

  # def last_carnet_model(old_carnet, new_carnet)
  #   # récupérer ses onglets
  #   old_onglets = old_carnet.onglets
  #   # créer les nouveaux onglets par rapport a ceux du dernier carnet
  #   old_onglets.each do |old_onglet|
  #     new_onglet = Onglet.new(nil, new_carnet.id, old_onglet.nom, new_carnet.uid_adm, old_onglet.ordre)
  #     new_onglet.create
  #   end
  # end
end
# rubocop:enable Metrics/ModuleLength
