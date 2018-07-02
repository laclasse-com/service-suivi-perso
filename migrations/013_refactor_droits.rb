# frozen_string_literal: true

Sequel.migration do
    change do
        alter_table(:droits) do
            drop_column :full_name
            set_column_allow_null :uid
            set_column_allow_null :profil
            add_foreign_key :onglet_id, :onglets, type: :Bignum, null: true
        end
    end
end
