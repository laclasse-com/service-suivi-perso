# frozen_string_literal: true

Sequel.migration do
    change do
        rename_table( :ressources, :resources )
    end
end
