# frozen_string_literal: true

Sequel.migration do
    change do
        # saisie_id
        alter_table(:ressources) do
            drop_foreign_key [:saisie_id]
            set_column_type :saisie_id, Integer
        end
        alter_table(:saisies) do
            set_column_type :id, Integer
        end
        alter_table(:ressources) do
            add_foreign_key [:saisie_id], :saisies
        end

        # onglet_id
        alter_table(:saisies) do
            drop_foreign_key [:onglet_id]
            set_column_type :onglet_id, Integer
        end
        alter_table(:droits) do
            drop_foreign_key [:onglet_id]
            set_column_type :onglet_id, Integer
        end
        alter_table(:onglets) do
            set_column_type :id, Integer
        end
        alter_table(:saisies) do
            add_foreign_key [:onglet_id], :onglets
        end
        alter_table(:droits) do
            add_foreign_key [:onglet_id], :onglets
        end

        # carnet_id
        alter_table(:onglets) do
            drop_foreign_key [:carnet_id]
            set_column_type :carnet_id, Integer
        end
        alter_table(:droits) do
            drop_foreign_key [:carnet_id]
            set_column_type :carnet_id, Integer
        end
        alter_table(:carnets) do
            set_column_type :id, Integer
        end
        alter_table(:onglets) do
            add_foreign_key [:carnet_id], :carnets
        end
        alter_table(:droits) do
            add_foreign_key [:carnet_id], :carnets
        end

        # droits.id
        alter_table(:droits) do
            set_column_type :id, Integer
        end
    end
end
