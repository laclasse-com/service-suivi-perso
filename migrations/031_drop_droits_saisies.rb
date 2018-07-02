# frozen_string_literal: true

Sequel.migration do
    change do
        alter_table(:droits) do
            drop_foreign_key :saisie_id
        end
    end
end
