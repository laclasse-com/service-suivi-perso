Sequel.migration do
  change do

    alter_table(:carnets) do
      drop_column :uid_adm
      drop_column :droits_pre
      drop_column :droits_elv
      drop_column :droits_pen
      drop_column :evignal
      rename_column :url_publique, :sharable_id
    end

    alter_table(:onglets) do
      drop_column :uid_own
      rename_column :url_publique, :sharable_id
    end

    alter_table(:droits) do
      drop_column :hopital
      drop_column :evignal
      drop_column :admin
      rename_column :profil, :profil_id
      set_column_allow_null :carnet_id
    end

    alter_table(:saisies) do
      drop_column :avatar
      drop_column :avatar_color
      drop_column :infos_owner
    end

    alter_table(:ressources) do
      rename_column :url, :reference
    end
  end
end
