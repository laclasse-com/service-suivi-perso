#coding: utf-8
#
# model for 'entrees' table
# generated 2014-02-06 10:24:32 +0100 by /usr/local/bin/rake
#
# ------------------------------+---------------------+----------+----------+------------+--------------------
# COLUMN_NAME                   | DATA_TYPE           | NULL? | KEY | DEFAULT | EXTRA
# ------------------------------+---------------------+----------+----------+------------+--------------------
# id                            | bigint(20)          | false    | PRI      |            | auto_increment
# uid                           | varchar(8)          | false    | UNI      |            | 
# code_matiere                  | varchar(10)         | false    |          |            | 
# date                          | datetime            | true     |          |            | 
# data                          | varchar(200)        | true     |          |            | 
# carnets_id                    | bigint(20)          | false    | PRI      |            | 
# ------------------------------+---------------------+----------+----------+------------+--------------------
#
class Entrees < Sequel::Model(:entrees)

  # Plugins
  plugin :validation_helpers
  plugin :json_serializer
  plugin :composition

  # Referential integrity
  many_to_one :carnets

  # Not nullable cols and unicity validation
  def validate
    super
    validates_presence [:uid, :code_matiere]
    validates_unique :uid, :id
  end
end
