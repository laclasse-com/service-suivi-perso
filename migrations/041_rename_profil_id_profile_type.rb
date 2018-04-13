Sequel.migration do
  change do
    alter_table(:droits) do
      rename_column :profil_id, :profile_type
    end
  end
end
