# frozen_string_literal: true

Sequel.migration do
    change do
        alter_table(:droits) do
            set_column_type :read, :boolean
            set_column_type :write, :boolean
        end
    end
end
