USER = {
  'id' => 999,
  'id_sconet' => nil,
  'login' => 'jsnickers',
  'id_jointure_aaf' => 663_390,
  'nom' => 'Snickers',
  'prenom' => 'Jean',
  'sexe' => 'M',
  'id_ent' => 'VAA99001',
  'date_naissance' => '1974-04-08',
  'adresse' => nil,
  'code_postal' => nil,
  'ville' => nil,
  'full_name' => 'Jean Snickers',
  'avatar' => 'url_avatar',
  'profils' => [
    {
      'profil_id' => 'ETA',
      'etablissement_nom' => 'CLG E-Vignal',
      'etablissement_code_uai' => '999999K',
      'profil_nom' => 'Administrateur',
      'profil_code_national' => 'National_ENS',
      'etablissement_id' => 9999
    } # ,
    # {
    #    "profil_id" => "ENS",
    #    "etablissement_nom" => "CLG-TOTO",
    #    "etablissement_code_uai" => "0690079K",
    #    "profil_nom" => "Enseignant",
    #    "profil_code_national" => "National_ENS",
    #    "etablissement_id" => 9998
    # }
  ],
  'default_password' => false,
  'roles' => [
    {
      'role_id' => 'ADM_ETB',
      'etablissement_nom' => 'CLG E-Vignal',
      'etablissement_code_uai' => '999999K',
      'etablissement_id' => 9999,
      'priority' => 1,
      'libelle' => 'administrateur'
    } # ,
    # {
    #    "role_id" => "PROF_ETB",
    #    "etablissement_nom" => "CLG-TOTO",
    #    "etablissement_code_uai" => "0690079K",
    #    "etablissement_id" => 9998,
    #    "priority" => 1,
    #    "libelle" => "Professeur"
    # }

  ],
  'emails' => [
    {
      'json_class' => 'Email',
      'id' => 9,
      'adresse' => 'jean.snickers@ac-lyon.fr',
      'principal' => true,
      'valide' => false,
      'academique' => true,
      'user_id' => 999
    }
  ],
  'etablissements' => [
    {
      'id' => 9999,
      'nom' => 'CLG E-Vignal',
      'profils' => [
        {
          'json_class' => 'ProfilUser',
          'profil_id' => 'ETA',
          'user_id' => 999,
          'etablissement_id' => 9999
        }
      ]
    } # ,
    # {
    #    "id" => 9998,
    #    "nom" => "CLG-TOTO",
    #    "profils" => [
    #       {
    #          "json_class" => "ProfilUser",
    #          "profil_id" => "ENS",
    #          "user_id" => 999,
    #          "etablissement_id" => 9998
    #       }
    #    ]
    # }
  ],
  'classes' => [
    {
      'etablissement_code' => '999999K',
      'classe_libelle' => '6B',
      'etablissement_nom' => 'CLG E-Vignal',
      'matiere_enseignee_id' => '999999',
      'matiere_libelle' => 'MATHS',
      'classe_id' => 1,
      'etablissement_id' => 9999,
      'prof_principal' => 'N'
    } # ,
    # {
    #    "etablissement_code" => "0690078K",
    #    "classe_libelle" => "5D",
    #    "etablissement_nom" => "CLG-VAL D'ARGENT",
    #    "matiere_enseignee_id" => "999999",
    #    "matiere_libelle" => "MATHS",
    #    "classe_id" => 2,
    #    "etablissement_id" => 9999,
    #    "prof_principal" => "N"
    # },
    # {
    #    "etablissement_code" => "0690078K",
    #    "classe_libelle" => "4E",
    #    "etablissement_nom" => "CLG-VAL D'ARGENT",
    #    "matiere_enseignee_id" => "999999",
    #    "matiere_libelle" => "MATHS",
    #    "classe_id" => 3,
    #    "etablissement_id" => 9999,
    #    "prof_principal" => "N"
    # },
    # {
    #    "etablissement_code" => "0690078K",
    #    "classe_libelle" => "3C",
    #    "etablissement_nom" => "CLG-VAL D'ARGENT",
    #    "matiere_enseignee_id" => "999999",
    #    "matiere_libelle" => "MATHS",
    #    "classe_id" => 4,
    #    "etablissement_id" => 9999,
    #    "prof_principal" => "N"
    # },
    # {
    #    "etablissement_code" => "0690079K",
    #    "classe_libelle" => "4E",
    #    "etablissement_nom" => "CLG-TOTO",
    #    "matiere_enseignee_id" => "999998",
    #    "matiere_libelle" => "MATHS",
    #    "classe_id" => 7,
    #    "etablissement_id" => 9998,
    #    "prof_principal" => "N"
    # }
  ],
  'telephones' => [

  ],
  'groupes_eleves' => [
    # {
    #    "etablissement_code" => "0690079K",
    #    "groupe_libelle" => "4E_LV1",
    #    "etablissement_nom" => "CLG-TOTO",
    #    "matiere_enseignee_id" => "999998",
    #    "matiere_libelle" => "ANGLAIS",
    #    "groupe_id" => 19,
    #    "etablissement_id" => 9998,
    #    "prof_principal" => "N"
    # }
  ],
  'groupes_libres' => [

  ],
  'matieres_enseignees' => [
    {
      'regroupement_id' => 1,
      'matiere_enseignee_id' => '999999',
      'prof_principal' => 'N',
      'libelle_aaf' => '6B',
      'type_regroupement_id' => 'CLS',
      'libelle_long' => 'MATHS',
      'code_uai' => '999999K'
    } # ,
    # {
    #    "regroupement_id" => 1,
    #    "matiere_enseignee_id" => "999999",
    #    "prof_principal" => "N",
    #    "libelle_aaf" => "5D",
    #    "type_regroupement_id" => "CLS",
    #    "libelle_long" => "MATHS",
    #    "code_uai" => "0690078K"
    # },
    # {
    #    "regroupement_id" => 5,
    #    "matiere_enseignee_id" => "999999",
    #    "prof_principal" => "N",
    #    "libelle_aaf" => "4E",
    #    "type_regroupement_id" => "CLS",
    #    "libelle_long" => "MATHS",
    #    "code_uai" => "0690078K"
    # },
    # {
    #    "regroupement_id" => 6,
    #    "matiere_enseignee_id" => "999999",
    #    "prof_principal" => "N",
    #    "libelle_aaf" => "3C",
    #    "type_regroupement_id" => "CLS",
    #    "libelle_long" => "MATHS",
    #    "code_uai" => "0690078K"
    # },
    # {
    #    "regroupement_id" => 7,
    #    "matiere_enseignee_id" => "999999",
    #    "prof_principal" => "N",
    #    "libelle_aaf" => "4E",
    #    "type_regroupement_id" => "CLS",
    #    "libelle_long" => "MATHS",
    #    "code_uai" => "0690079K"
    # }
  ],
  'parents' => [

  ],
  'enfants' => [

  ]
}

SEARCH_USER = [{
  'id' => 998,
  'id_sconet' => nil,
  'login' => 'pchocobon',
  'id_jointure_aaf' => 663_391,
  'nom' => 'Chocobon',
  'prenom' => 'Patrick',
  'sexe' => 'M',
  'id_ent' => 'VAA99091',
  'date_naissance' => '1990-09-22',
  'adresse' => nil,
  'code_postal' => nil,
  'ville' => nil,
  'full_name' => 'Patrick Chocobon',
  'avatar' => 'url_avatar',
  'profils' => [
    {
      'profil_id' => 'ELV',
      'etablissement_nom' => 'CLG E-Vignal',
      'etablissement_code_uai' => '999999K',
      'profil_nom' => 'Elève',
      'profil_code_national' => 'National_ELV',
      'etablissement_id' => 9999
    } # ,
    # {
    #    "profil_id" => "ENS",
    #    "etablissement_nom" => "CLG-TOTO",
    #    "etablissement_code_uai" => "0690079K",
    #    "profil_nom" => "Enseignant",
    #    "profil_code_national" => "National_ENS",
    #    "etablissement_id" => 9998
    # }
  ],
  'default_password' => false,
  'roles' => [
    {
      'role_id' => 'ELV_ETB',
      'etablissement_nom' => 'CLG E-Vignal',
      'etablissement_code_uai' => '999999K',
      'etablissement_id' => 9999,
      'priority' => 1,
      'libelle' => 'élève'
    } # ,
    # {
    #    "role_id" => "PROF_ETB",
    #    "etablissement_nom" => "CLG-TOTO",
    #    "etablissement_code_uai" => "0690079K",
    #    "etablissement_id" => 9998,
    #    "priority" => 1,
    #    "libelle" => "Professeur"
    # }

  ],
  'emails' => [
    {
      'json_class' => 'Email',
      'id' => 10,
      'adresse' => 'patrick.chocobon@ac-lyon.fr',
      'principal' => true,
      'valide' => false,
      'academique' => true,
      'user_id' => 998
    }
  ],
  'etablissements' => [
    {
      'id' => 9999,
      'nom' => 'CLG E-Vignal',
      'profils' => [
        {
          'json_class' => 'ProfilUser',
          'profil_id' => 'ELV',
          'user_id' => 998,
          'etablissement_id' => 9999
        }
      ]
    } # ,
    # {
    #    "id" => 9998,
    #    "nom" => "CLG-TOTO",
    #    "profils" => [
    #       {
    #          "json_class" => "ProfilUser",
    #          "profil_id" => "ENS",
    #          "user_id" => 999,
    #          "etablissement_id" => 9998
    #       }
    #    ]
    # }
  ],
  'classes' => [
    {
      'etablissement_code' => '999999K',
      'classe_libelle' => '6B',
      'etablissement_nom' => 'CLG E-Vignal',
      'matiere_enseignee_id' => '999999',
      'matiere_libelle' => 'MATHS',
      'classe_id' => 1,
      'etablissement_id' => 9999,
      'prof_principal' => 'N'
    } # ,
    # {
    #    "etablissement_code" => "0690078K",
    #    "classe_libelle" => "5D",
    #    "etablissement_nom" => "CLG-VAL D'ARGENT",
    #    "matiere_enseignee_id" => "999999",
    #    "matiere_libelle" => "MATHS",
    #    "classe_id" => 2,
    #    "etablissement_id" => 9999,
    #    "prof_principal" => "N"
    # },
    # {
    #    "etablissement_code" => "0690078K",
    #    "classe_libelle" => "4E",
    #    "etablissement_nom" => "CLG-VAL D'ARGENT",
    #    "matiere_enseignee_id" => "999999",
    #    "matiere_libelle" => "MATHS",
    #    "classe_id" => 3,
    #    "etablissement_id" => 9999,
    #    "prof_principal" => "N"
    # },
    # {
    #    "etablissement_code" => "0690078K",
    #    "classe_libelle" => "3C",
    #    "etablissement_nom" => "CLG-VAL D'ARGENT",
    #    "matiere_enseignee_id" => "999999",
    #    "matiere_libelle" => "MATHS",
    #    "classe_id" => 4,
    #    "etablissement_id" => 9999,
    #    "prof_principal" => "N"
    # },
    # {
    #    "etablissement_code" => "0690079K",
    #    "classe_libelle" => "4E",
    #    "etablissement_nom" => "CLG-TOTO",
    #    "matiere_enseignee_id" => "999998",
    #    "matiere_libelle" => "MATHS",
    #    "classe_id" => 7,
    #    "etablissement_id" => 9998,
    #    "prof_principal" => "N"
    # }
  ],
  'telephones' => [

  ],
  'groupes_eleves' => [
    # {
    #    "etablissement_code" => "0690079K",
    #    "groupe_libelle" => "4E_LV1",
    #    "etablissement_nom" => "CLG-TOTO",
    #    "matiere_enseignee_id" => "999998",
    #    "matiere_libelle" => "ANGLAIS",
    #    "groupe_id" => 19,
    #    "etablissement_id" => 9998,
    #    "prof_principal" => "N"
    # }
  ],
  'groupes_libres' => [

  ],
  'matieres_enseignees' => [
    {
      'regroupement_id' => 1,
      'matiere_enseignee_id' => '999999',
      'prof_principal' => 'N',
      'libelle_aaf' => '6B',
      'type_regroupement_id' => 'CLS',
      'libelle_long' => 'MATHS',
      'code_uai' => '999999K'
    } # ,
    # {
    #    "regroupement_id" => 1,
    #    "matiere_enseignee_id" => "999999",
    #    "prof_principal" => "N",
    #    "libelle_aaf" => "5D",
    #    "type_regroupement_id" => "CLS",
    #    "libelle_long" => "MATHS",
    #    "code_uai" => "0690078K"
    # },
    # {
    #    "regroupement_id" => 5,
    #    "matiere_enseignee_id" => "999999",
    #    "prof_principal" => "N",
    #    "libelle_aaf" => "4E",
    #    "type_regroupement_id" => "CLS",
    #    "libelle_long" => "MATHS",
    #    "code_uai" => "0690078K"
    # },
    # {
    #    "regroupement_id" => 6,
    #    "matiere_enseignee_id" => "999999",
    #    "prof_principal" => "N",
    #    "libelle_aaf" => "3C",
    #    "type_regroupement_id" => "CLS",
    #    "libelle_long" => "MATHS",
    #    "code_uai" => "0690078K"
    # },
    # {
    #    "regroupement_id" => 7,
    #    "matiere_enseignee_id" => "999999",
    #    "prof_principal" => "N",
    #    "libelle_aaf" => "4E",
    #    "type_regroupement_id" => "CLS",
    #    "libelle_long" => "MATHS",
    #    "code_uai" => "0690079K"
    # }
  ],
  'parents' => [

  ],
  'enfants' => [

  ]
}]

MOCK_USERS_LISTE = [
  {
    'id_ent' => 'VAA99001',
    'prenom' => 'Jean',
    'nom' => 'Snickers',
    'avatar' => 'url_avatar'
  },
  {
    'id_ent' => 'VAA99002',
    'prenom' => 'Polo',
    'nom' => 'Leonidas',
    'avatar' => 'url_avatar'
  },
  {
    'id_ent' => 'VAA99003',
    'prenom' => 'Stéphanie',
    'nom' => 'Milkiway',
    'avatar' => 'url_avatar'
  },
  {
    'id_ent' => 'VAA99091',
    'prenom' => 'Patrick',
    'nom' => 'Chocobon',
    'avatar' => 'url_avatar'
  },
  {
    'id_ent' => 'VAA99092',
    'prenom' => 'Alice',
    'nom' => 'Skitles',
    'avatar' => 'url_avatar'
  },
  {
    'id_ent' => 'VAA99093',
    'prenom' => 'Michèle',
    'nom' => 'Chamalow',
    'avatar' => 'url_avatar'
  }
]
