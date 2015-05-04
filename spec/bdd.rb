# Module de mock des données de la base.
module BDD
  attr_reader :ids_datas
  @ids_datas = {}

  def self::clear_db
    Docs.all.each(&:delete)
    DroitsSpecifiques.all.each(&:delete)
    EntreesOnglets.all.each(&:delete)
    Saisies.all.each(&:delete)
    CarnetsOnglets.all.each(&:delete)
    Onglets.all.each(&:delete)
    Carnets.all.each(&:delete)
  end

  def self::load_in_tables
    # permet de ne pas avoir de contrainte sur la primary key
    CarnetsOnglets.unrestrict_primary_key
    EntreesOnglets.unrestrict_primary_key

    # #Création des carnets
    ################################### CARNET 1 ####################################################

    carnet1 = Carnets.create(
      uid_elv: 'VAA99091',
      uid_adm: 'VAA99001',
      uai: '999999K',
      cls_id: 1,
      url_publique: nil,
      date_creation: Time.now,
      evignal: true)

    # Créations des onglets
    carnet1_onglet1 = Onglets.create(
      nom: 'Maths',
      uid_own: 'VAA99001',
      date_creation: Time.now,
      url_publique: nil)

    CarnetsOnglets.create(
      carnets_id: carnet1.id,
      onglets_id: carnet1_onglet1.id,
      ordre: 1)

    # création des saisies
    carnet1_onglet1_saisie1 = Saisies.create(
      uid: 'VAA99001', date_creation: Time.now, contenu: '<strong>Toto</strong> est un petit garçon', carnets_id: carnet1.id, date_modification: Time.now, infos_owner: 'Jean Snickers - Administrateur - CLG E-Vignal', avatar: 'url_avatar', avatar_color: 'rgba(128,186,102,0.7)', back_color: 'rgba(235,84,84,0.3)')
    EntreesOnglets.create(saisies_id: carnet1_onglet1_saisie1.id, onglets_id: carnet1_onglet1.id)

    # création des documents
    carnet1_onglet1_saisie1_doc1 = Docs.create(nom: 'devoir_toto.doc', url: '987md5432', saisies_id: carnet1_onglet1_saisie1.id)

    carnet1_onglet1_saisie2 = Saisies.create(uid: 'VAA99091', date_creation: Time.now, contenu: "Mais Toto s'est lacer ses chaussure tout seul.", carnets_id: carnet1.id, date_modification: Time.now, infos_owner: 'Patrick Chocobon - Elève - CLG E-Vignal', avatar: 'url_avatar', avatar_color: 'rgba(235,84,84,0.7)', back_color: 'rgba(232,194,84,0.9)')
    EntreesOnglets.create(saisies_id: carnet1_onglet1_saisie2.id, onglets_id: carnet1_onglet1.id)

    # création des droits
    DroitsSpecifiques.create(uid: 'VAA99001', read: 1, write: 1, carnets_id: carnet1.id, date_creation: Time.now, full_name: 'Jean Snickers', profil: 'admin', admin: 1, hopital: 0, evignal: 1)
    DroitsSpecifiques.create(uid: 'VAA99091', read: 1, write: 1, carnets_id: carnet1.id, date_creation: Time.now, full_name: 'Patrick Chocobon', profil: 'élève', admin: 0, hopital: 0, evignal: 1)

    ####################################################################################################

    ################################### CARNET 2 ####################################################

    carnet2 = Carnets.create(uid_elv: 'VAA99092', uid_adm: 'VAA99002', uai: '666666K', cls_id: 2, url_publique: 'https://laclasse/suivi/public/111md5111', date_creation: Time.now, evignal: false)

    # Créations des onglets
    carnet2_onglet1 = Onglets.create(nom: 'Anglais', uid_own: 'VAA99002', date_creation: Time.now, url_publique: 'https://laclasse/suivi/public/111md5111')
    CarnetsOnglets.create(carnets_id: carnet2.id, onglets_id: carnet2_onglet1.id, ordre: 1)

    # création des saisies
    carnet2_onglet1_saisie1 = Saisies.create(uid: 'VAA99002', date_creation: Time.now, contenu: '<strong>Tata</strong> est une petite fille', carnets_id: carnet2.id, date_modification: Time.now, infos_owner: 'Polo Leonidas - Professeur - CLG CHAUVIN', avatar: 'url_avatar', avatar_color: 'rgba(26,161,204,0.7)', back_color: 'rgba(156,117,171,0.3)')
    EntreesOnglets.create(saisies_id: carnet2_onglet1_saisie1.id, onglets_id: carnet2_onglet1.id)

    # création des documents
    carnet2_onglet1_saisie1_doc1 = Docs.create(nom: 'devoir_tata.txt', url: '333md5333', saisies_id: carnet2_onglet1_saisie1.id)

    carnet2_onglet1_saisie2 = Saisies.create(uid: 'VAA99092', date_creation: Time.now, contenu: "Mais Tata s'est aller au toilette toute seule.", carnets_id: carnet2.id, date_modification: Time.now, infos_owner: 'Alice Skitles - Elève - CLG CHAUVIN', avatar: 'url_avatar', avatar_color: 'rgba(235,84,84,0.7)', back_color: 'rgba(232,194,84,0.9)')
    EntreesOnglets.create(saisies_id: carnet2_onglet1_saisie2.id, onglets_id: carnet2_onglet1.id)

    carnet2_onglet2 = Onglets.create(nom: 'Histoire', uid_own: 'VAA99003', date_creation: Time.now, url_publique: nil)
    CarnetsOnglets.create(carnets_id: carnet2.id, onglets_id: carnet2_onglet2.id, ordre: 2)

    # création des droits
    DroitsSpecifiques.create(uid: 'VAA99002', read: 1, write: 1, carnets_id: carnet2.id, date_creation: Time.now, full_name: 'Polo Leonidas', profil: 'prof', admin: 1, hopital: 0, evignal: 0)
    DroitsSpecifiques.create(uid: 'VAA99003', read: 1, write: 1, carnets_id: carnet2.id, date_creation: Time.now, full_name: 'Stéphanie Milkiway', profil: 'admin', admin: 1, hopital: 0, evignal: 0)
    DroitsSpecifiques.create(uid: 'VAA99092', read: 1, write: 1, carnets_id: carnet2.id, date_creation: Time.now, full_name: 'Alice Skitles', profil: 'élève', admin: 0, hopital: 0, evignal: 0)

    ####################################################################################################

    ################################### CARNET 3 ####################################################

    carnet3 = Carnets.create(uid_elv: 'VAA99093', uid_adm: 'VAA99003', uai: '666666K', cls_id: 2, url_publique: nil, date_creation: Time.now, evignal: false)

    # création des droits
    DroitsSpecifiques.create(uid: 'VAA99093', read: 0, write: 0, carnets_id: carnet3.id, date_creation: Time.now, full_name: 'Michèle Chamalow', profil: 'élève', admin: 0, hopital: 0, evignal: 0)
    DroitsSpecifiques.create(uid: 'VAA99003', read: 1, write: 1, carnets_id: carnet3.id, date_creation: Time.now, full_name: 'Stéphanie Milkiway', profil: 'admin', admin: 1, hopital: 0, evignal: 0)

    ####################################################################################################

    # #####sauvegarde des ids des données
    @ids_datas[:carnet1] = {
      id: carnet1.id,
      onglet1: {
        id: carnet1_onglet1.id,
        saisie1: {
          id: carnet1_onglet1_saisie1.id,
          doc1: {
            id: carnet1_onglet1_saisie1_doc1.id
          }
        },
        saisie2: {
          id: carnet1_onglet1_saisie2.id
        }
      }
    }

    @ids_datas[:carnet2] = {
      id: carnet2.id,
      onglet1: {
        id: carnet2_onglet1.id,
        saisie1: {
          id: carnet2_onglet1_saisie1.id,
          doc1: {
            id: carnet2_onglet1_saisie1_doc1.id
          }
        },
        saisie2: {
          id: carnet2_onglet1_saisie2.id
        }
      },
      onglet2: {
        id: carnet2_onglet2.id
      }
    }

    @ids_datas[:carnet3] = {
      id: carnet3.id
    }
  end
end
