# frozen_string_literal: true

Sequel.migration do
    change do
        rename_table( :onglets, :pages )
        rename_table( :saisies_onglets, :saisies_pages )

        alter_table( :ressources ) do
            rename_column( :onglet_id, :page_id )
        end

        alter_table( :rights ) do
            rename_column( :onglet_id, :page_id )
        end

        alter_table( :saisies_pages ) do
            rename_column( :onglet_id, :page_id )
        end
    end
end
