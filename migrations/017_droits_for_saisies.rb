Sequel.migration do
  change do
    alter_table(:droits) do
      add_foreign_key :saisie_id, :saisies, null: true
    end
  end
end
