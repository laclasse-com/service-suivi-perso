USER = {
   "id" => 999,
   "id_sconet" => nil,
   "login" => "hquenin",
   "id_jointure_aaf" => 663390,
   "nom" => "QUENIN",
   "prenom" => "Homer",
   "sexe" => "F",
   "id_ent" => "VAA99999",
   "date_naissance" => "1974-04-08",
   "adresse" => nil,
   "code_postal" => nil,
   "ville" => nil,
   "full_name" => "Quenin Homer",
   "profils" => [
      {
         "profil_id" => "ENS",
         "etablissement_nom" => "CLG-VAL D'ARGENT",
         "etablissement_code_uai" => "0690078K",
         "profil_nom" => "Enseignant",
         "profil_code_national" => "National_ENS",
         "etablissement_id" => 9999
      },
      {
         "profil_id" => "ENS",
         "etablissement_nom" => "CLG-TOTO",
         "etablissement_code_uai" => "0690079K",
         "profil_nom" => "Enseignant",
         "profil_code_national" => "National_ENS",
         "etablissement_id" => 9998
      }
   ],
   "default_password" => false,
   "roles" => [
      {
         "role_id" => "PROF_ETB",
         "etablissement_nom" => "CLG-VAL D'ARGENT",
         "etablissement_code_uai" => "0690078K",
         "etablissement_id" => 9999,
         "priority" => 1,
         "libelle" => "Professeur"
      },
      {
         "role_id" => "PROF_ETB",
         "etablissement_nom" => "CLG-TOTO",
         "etablissement_code_uai" => "0690079K",
         "etablissement_id" => 9998,
         "priority" => 1,
         "libelle" => "Professeur"
      }

   ],
   "emails" => [
      {
         "json_class" => "Email",
         "id" => 9,
         "adresse" => "Homer.Quenin@ac-lyon.fr",
         "principal" => true,
         "valide" => false,
         "academique" => true,
         "user_id" => 999
      }
   ],
   "etablissements" => [
      {
         "id" => 9999,
         "nom" => "CLG-VAL D'ARGENT",
         "profils" => [
            {
               "json_class" => "ProfilUser",
               "profil_id" => "ENS",
               "user_id" => 999,
               "etablissement_id" => 9999
            }
         ]
      },
      {
         "id" => 9998,
         "nom" => "CLG-TOTO",
         "profils" => [
            {
               "json_class" => "ProfilUser",
               "profil_id" => "ENS",
               "user_id" => 999,
               "etablissement_id" => 9998
            }
         ]
      }
   ],
   "classes" => [
      {
         "etablissement_code" => "0690078K",
         "classe_libelle" => "6B",
         "etablissement_nom" => "CLG-VAL D'ARGENT",
         "matiere_enseignee_id" => "999999",
         "matiere_libelle" => "MATHS",
         "classe_id" => 1,
         "etablissement_id" => 9999,
         "prof_principal" => "N"
      },
      {
         "etablissement_code" => "0690078K",
         "classe_libelle" => "5D",
         "etablissement_nom" => "CLG-VAL D'ARGENT",
         "matiere_enseignee_id" => "999999",
         "matiere_libelle" => "MATHS",
         "classe_id" => 2,
         "etablissement_id" => 9999,
         "prof_principal" => "N"
      },
      {
         "etablissement_code" => "0690078K",
         "classe_libelle" => "4E",
         "etablissement_nom" => "CLG-VAL D'ARGENT",
         "matiere_enseignee_id" => "999999",
         "matiere_libelle" => "MATHS",
         "classe_id" => 3,
         "etablissement_id" => 9999,
         "prof_principal" => "N"
      },
      {
         "etablissement_code" => "0690078K",
         "classe_libelle" => "3C",
         "etablissement_nom" => "CLG-VAL D'ARGENT",
         "matiere_enseignee_id" => "999999",
         "matiere_libelle" => "MATHS",
         "classe_id" => 4,
         "etablissement_id" => 9999,
         "prof_principal" => "N"
      },
      {
         "etablissement_code" => "0690079K",
         "classe_libelle" => "4E",
         "etablissement_nom" => "CLG-TOTO",
         "matiere_enseignee_id" => "999998",
         "matiere_libelle" => "MATHS",
         "classe_id" => 7,
         "etablissement_id" => 9998,
         "prof_principal" => "N"
      }
   ],
   "telephones" => [

   ],
   "groupes_eleves" => [
      {
         "etablissement_code" => "0690079K",
         "groupe_libelle" => "4E_LV1",
         "etablissement_nom" => "CLG-TOTO",
         "matiere_enseignee_id" => "999998",
         "matiere_libelle" => "ANGLAIS",
         "groupe_id" => 19,
         "etablissement_id" => 9998,
         "prof_principal" => "N"
      }
   ],
   "groupes_libres" => [

   ],
   "matieres_enseignees" => [
      {
         "regroupement_id" => 1,
         "matiere_enseignee_id" => "999999",
         "prof_principal" => "N",
         "libelle_aaf" => "6B",
         "type_regroupement_id" => "CLS",
         "libelle_long" => "MATHS",
         "code_uai" => "0690078K"
      },
      {
         "regroupement_id" => 1,
         "matiere_enseignee_id" => "999999",
         "prof_principal" => "N",
         "libelle_aaf" => "5D",
         "type_regroupement_id" => "CLS",
         "libelle_long" => "MATHS",
         "code_uai" => "0690078K"
      },
      {
         "regroupement_id" => 5,
         "matiere_enseignee_id" => "999999",
         "prof_principal" => "N",
         "libelle_aaf" => "4E",
         "type_regroupement_id" => "CLS",
         "libelle_long" => "MATHS",
         "code_uai" => "0690078K"
      },
      {
         "regroupement_id" => 6,
         "matiere_enseignee_id" => "999999",
         "prof_principal" => "N",
         "libelle_aaf" => "3C",
         "type_regroupement_id" => "CLS",
         "libelle_long" => "MATHS",
         "code_uai" => "0690078K"
      },
      {
         "regroupement_id" => 7,
         "matiere_enseignee_id" => "999999",
         "prof_principal" => "N",
         "libelle_aaf" => "4E",
         "type_regroupement_id" => "CLS",
         "libelle_long" => "MATHS",
         "code_uai" => "0690079K"
      }
   ],
   "parents" => [

   ],
   "enfants" => [

   ]
}