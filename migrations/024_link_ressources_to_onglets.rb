Sequel.migration do
  change do
    alter_table( :ressources ) do
      add_foreign_key :onglet_id, :onglets
    end
  end
end
