Sequel.migration do
  change do
    alter_table(:droits) do
      add_column :group_id, Integer, null: true
    end
  end
end
