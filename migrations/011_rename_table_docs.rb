# frozen_string_literal: true

Sequel.migration do
    change do
        rename_table :docs, :ressources
    end
end
