Sequel.migration do
  change do
    alter_table(:saisies) do
      set_column_type :contenu, :Text
    end
  end
end
