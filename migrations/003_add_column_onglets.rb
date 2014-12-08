Sequel.migration do
  change do
    alter_table(:onglets) do
      add_column :url_publique, String, :size=>2000, :default=>nil, :null=>true
    end
end