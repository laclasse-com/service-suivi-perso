#
# Création de toutes les tables
#
Sequel.migration do
  change do
    create_table(:carnets, ignore_index_errors: true) do
      primary_key :id, type: Integer
      String :uid_elv, size: 8, null: false
      String :uid_adm, size: 8, null: false
      String :uai, size: 8, null: false
      Bignum :cls_id, null: false
      String :url_publique, size: 2000, default: nil, null: true
      Date :date_creation, default: nil, null: true
      Integer :droits_pre, size: 11, default: '0', null: true
      Integer :droits_elv, size: 11, default: '0', null: true
      Integer :droits_pen, size: 11, default: '0', null: true

      index [:uid_elv], name: :uid_UNIQUE, unique: true
    end

    create_table(:onglets, ignore_index_errors: true) do
      primary_key :id, type: Integer
      String :nom, size: 45, null: false
      String :uid_own, size: 8, null: false
      Date :date_creation, default: nil, null: true

      index [:id], name: :id_UNIQUE, unique: true
    end

    create_table(:carnets_onglets, ignore_index_errors: true) do
      Bignum :carnets_id, null: false
      Bignum :onglets_id, null: false
      Integer :ordre, size: 11, default: '1', null: true
      primary_key %i(carnets_id onglets_id), name: :carnets_onglets_pk
      foreign_key [:carnets_id], :carnets, name: :fk_carnets_has_onglets_carnets1, key: [:id]
      foreign_key [:onglets_id], :onglets, name: :fk_carnets_has_onglets_onglets1, key: [:id]
      index [:carnets_id], name: :fk_carnets_has_onglets_carnets1_idx
      index [:onglets_id], name: :fk_carnets_has_onglets_onglets1_idx
    end

    create_table(:droits_specifiques, ignore_index_errors: true) do
      primary_key :id, type: Integer
      String :uid, size: 8, null: false
      String :full_name, size: 200, null: false
      String :profil, size: 45, null: false
      Integer :read, size: 11, default: '0', null: true
      Integer :write, size: 11, default: '0', null: true
      Bignum :carnets_id, null: false
      Date :date_creation, default: nil, null: true

      foreign_key [:carnets_id], :carnets, name: :fk_droits_specifiques_carnets1, key: [:id]
      index [:id], name: :id_UNIQUE, unique: true
      index [:carnets_id], name: :fk_droits_specifiques_carnets1_idx
    end

    create_table(:saisies, ignore_index_errors: true) do
      primary_key :id, type: Integer
      String :uid, size: 8, null: false
      Date :date_creation, default: nil, null: true
      String :contenu, default: nil, null: true
      Bignum :carnets_id, null: false
      Date :date_modification, default: nil, null: true
      String :infos_owner, size: 250, null: false
      String :avatar, size: 200, null: false

      foreign_key [:carnets_id], :carnets, name: :fk_entrees_carnets, key: [:id]
      index [:id], name: :id_UNIQUE, unique: true
      index [:carnets_id], name: :fk_entrees_carnets_idx
    end

    create_table(:entrees_onglets, ignore_index_errors: true) do
      Bignum :saisies_id, null: false
      Bignum :onglets_id, null: false
      primary_key %i(saisies_id onglets_id), name: :entrees_onglets_pk
      foreign_key [:saisies_id], :saisies, name: :fk_entrees_has_onglets_entrees1, key: [:id]
      foreign_key [:onglets_id], :onglets, name: :fk_entrees_has_onglets_entrees1_idx, key: [:id]
      index [:saisies_id], name: :fk_entrees_has_onglets_entrees1_idx
      index [:onglets_id], name: :fk_entrees_has_onglets_onglets1_idx
    end
  end
end
