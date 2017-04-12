Sequel.migration do
  change do
    alter_table(:onglets) do
      drop_column :ordre
    end
  end
end
