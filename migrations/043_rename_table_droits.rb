Sequel.migration do
    change do
        rename_table( :droits, :rights )
    end
end
