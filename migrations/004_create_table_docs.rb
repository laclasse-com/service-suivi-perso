Sequel.migration do
  change do
    create_table(:docs, :ignore_index_errors=>true) do
      Bignum :id, :null=>false
      Bignum :saisies_id, :null=>false
      String :nom, :size=>250, :null=>false
      String :url, :size=>2000, :null=>false
      primary_key [:id, :saisies_id], :name=>:docs_pk
      foreign_key [:saisies_id], :saisies, :name=>:fk_saisies_has_docs1, :key=>[:id]
      index [:saisies_id], :name=>:fk_saisies_has_docs1_idx
      index [:id], :name=>:id_UNIQUE, :unique=>true
    end
  end
end