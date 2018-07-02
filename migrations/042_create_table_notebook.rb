Sequel.migration do
    change do
        create_table(:notebook) do
            primary_key :id, type: Integer
            String :owner, null: false
            String :name, null: true
            String :targets, null: false
        end
    end
end
