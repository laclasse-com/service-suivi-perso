Sequel.migration do
    change do
        create_table(:notebooks) do
            primary_key :id, type: Integer
            String :owner, null: false
            String :name, null: true
            String :targets, size: 32_767, null: false
        end
    end
end
