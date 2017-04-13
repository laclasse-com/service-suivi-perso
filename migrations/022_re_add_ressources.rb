Sequel.migration do
  change do
    create_table( :ressources ) do
      primary_key :id
      foreign_key :saisie_id, :saisies
      String :link
      String :type
    end
  end
end
