Sequel.migration do
  change do
    alter_table(:saisies) do
      rename_column :contenu, :content
    end
  end
end
