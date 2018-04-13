Sequel.migration do
  change do
    alter_table(:onglets) do
      rename_column :nom, :name
    end
  end
end
