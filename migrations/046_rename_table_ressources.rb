Sequel.migration do
    change do
        rename_table( :ressources, :resources )
    end
end
