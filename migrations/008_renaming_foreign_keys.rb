Sequel.migration do
  change do
    alter_table(:docs) do
      rename_column :saisies_id, :saisie_id
    end

    alter_table(:droits_specifiques) do
      rename_column :carnets_id, :carnet_id
    end
  end
end
