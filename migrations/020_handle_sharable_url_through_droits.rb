# frozen_string_literal: true

Sequel.migration do
    change do
        alter_table(:droits) do
            add_column :sharable_id, String
        end

        alter_table(:onglets) do
            drop_column :sharable_id
        end

        alter_table(:carnets) do
            drop_column :sharable_id
        end
    end
end
