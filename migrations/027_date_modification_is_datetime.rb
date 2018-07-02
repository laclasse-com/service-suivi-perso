# frozen_string_literal: true

Sequel.migration do
    change do
        alter_table(:saisies) do
            set_column_type :date_modification, DateTime
        end
    end
end
