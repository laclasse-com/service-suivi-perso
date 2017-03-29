Sequel.migration do
  change do
    rename_table :docs, :ressources
  end
end
