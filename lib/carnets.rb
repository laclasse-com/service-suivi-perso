# coding: utf-8
# Module de fonctions liées aux carnets

# rubocop:disable Metrics/ModuleLength
module CarnetsLib
  module_function

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
end
# rubocop:enable Metrics/ModuleLength
