# frozen_string_literal: true

Sequel.migration do
    change do
        alter_table(:saisies) do
            drop_column :back_color
        end
    end
end
