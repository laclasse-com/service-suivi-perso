Sequel.migration do
  change do
    rename_table :droits_specifiques, :droits
  end
end
