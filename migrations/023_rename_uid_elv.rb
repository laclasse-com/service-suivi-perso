# frozen_string_literal: true

Sequel.migration do
    change do
        alter_table(:carnets) do
            rename_column :uid_elv, :uid_eleve
        end
    end
end
