Sequel.migration do
  change do
    alter_table(:carnets) do
      add_column :evignal, TrueClass, :default=>false, :null=>false
    end

     alter_table(:droits_specifiques) do
      add_column :hopital, TrueClass, :default=>false, :null=>false
      add_column :evignal, TrueClass, :default=>false, :null=>false
    end
  end
end