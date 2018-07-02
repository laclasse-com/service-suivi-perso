# frozen_string_literal: true

Sequel.migration do
    change do
        [:saisies, :onglets, :carnets].each do |table|
            alter_table( table ) do
                rename_column :date_creation, :ctime
            end
        end

        alter_table(:saisies) do
            rename_column :date_modification, :mtime
        end
    end
end
