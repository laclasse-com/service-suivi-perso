Sequel.migration do
  change do
    alter_table(:droits) do
      drop_foreign_key :carnet_id
    end
  end
end
