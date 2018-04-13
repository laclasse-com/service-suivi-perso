Sequel.migration do
  change do
    alter_table(:onglets) do
      add_column :uid_student, String, size: 8, null: true
    end

    DB[:carnets].all.each do |carnet|
      DB[:onglets].where(carnet_id: carnet[:id])
                  .update(uid_student: carnet[:uid_student])
    end

    alter_table(:onglets) do
      drop_foreign_key :carnet_id
      set_column_not_null :uid_student
    end

    drop_table( :carnets )
  end
end
