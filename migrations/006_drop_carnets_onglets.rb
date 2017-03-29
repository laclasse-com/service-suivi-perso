Sequel.migration do
  change do
    alter_table(:onglets) do
      add_column :ordre, Integer, null: true
      add_foreign_key :carnet_id, :carnets, type: :Bignum, null: true
    end

    DB[:carnets_onglets].all.each do |co|
      DB[:onglets].where(id: co[:onglets_id])
                  .update( carnet_id: co[:carnets_id],
                           ordre: co[:ordre] )
    end

    drop_table( :carnets_onglets )
  end
end
