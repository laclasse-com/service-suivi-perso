# frozen_string_literal: true

Sequel.migration do
    change do
        alter_table(:droits) do
            add_column :manage, :boolean, default: false
        end

        DB[:droits].where(write: true).update(manage: true)
    end
end
