Sequel.migration do
  change do
    alter_table(:saisies) do
      add_column :avatar_color, String, size: 200, null: false
      add_column :back_color, String, size: 200, null: false
    end

    alter_table(:droits_specifiques) do
      add_column :admin, Integer, size: 11, default: '0', null: true
    end
  end
end
