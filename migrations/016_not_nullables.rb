Sequel.migration do
  change do
    alter_table(:saisies) do
      drop_foreign_key [:onglet_id]
      set_column_not_null :onglet_id
      add_foreign_key [:onglet_id], :onglets
    end
  end
end
