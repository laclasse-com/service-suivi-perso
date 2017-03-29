Sequel.migration do
  change do
    alter_table(:carnets) do
      drop_column :cls_id
    end
  end
end
