# frozen_string_literal: true

Sequel.migration do
    up do
        puts "create_table!(:saisies_onglets)"
        create_table!(:saisies_onglets) do
            primary_key %i[saisie_id onglet_id]
            foreign_key :saisie_id, :saisies, null: false
            foreign_key :onglet_id, :onglets, null: false
        end

        puts "move foreign keys"
        DB[:saisies].where( Sequel.~(onglet_id: nil) )
                    .select(:id, :onglet_id)
                    .all
                    .each do |saisie|
            DB[:saisies_onglets].insert(saisie_id: saisie[:id], onglet_id: saisie[:onglet_id])
        end

        puts "drop single foreign keys"
        alter_table(:saisies) do
            drop_foreign_key :onglet_id
        end
    end
end
