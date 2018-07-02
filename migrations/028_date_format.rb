# frozen_string_literal: true

Sequel.migration do
    change do
        alter_table(:carnets) do
            set_column_type :date_creation, DateTime
        end

        alter_table(:onglets) do
            set_column_type :date_creation, DateTime
        end

        alter_table(:saisies) do
            set_column_type :date_creation, DateTime
            set_column_type :date_modification, DateTime
        end
    end
end
