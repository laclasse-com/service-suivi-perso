Sequel.migration do
  change do
    alter_table(:saisies) do
      rename_column :uid, :uid_author
    end
  end
end
