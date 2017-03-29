Sequel.migration do
  change do
    alter_table(:saisies) do
      add_foreign_key :onglet_id, :onglets, type: :Bignum, null: true
    end

    DB[:entrees_onglets].all.each do |co|
      DB[:saisies].where(id: co[:onglets_id])
                  .update( onglet_id: co[:onglets_id] )
    end

    drop_table( :entrees_onglets )

    alter_table(:saisies) do
      drop_foreign_key :carnets_id
    end
  end
end
