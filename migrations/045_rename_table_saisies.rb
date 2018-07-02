# frozen_string_literal: true

Sequel.migration do
    change do
        rename_table( :saisies, :messages )
        rename_table( :saisies_pages, :messages_pages )

        alter_table( :ressources ) do
            rename_column( :saisie_id, :message_id )
        end

        alter_table( :messages_pages ) do
            rename_column( :saisie_id, :message_id )
        end
    end
end
