Sequel.migration do
  change do
    alter_table(:carnets) do
      drop_column :uai
    end
  end
end
