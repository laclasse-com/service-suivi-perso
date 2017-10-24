Sequel.migration do
  change do
    alter_table(:saisies) do
      add_column :pinned, :boolean, default: false, null: true
    end

    DB[:saisies].update(pinned: false)

    alter_table(:saisies) do
      set_column_not_null :pinned
    end
  end
end
