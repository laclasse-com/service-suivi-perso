#coding: utf-8
#
# model for 'carnets' table
# generated 2014-03-13 15:43:18 +0100 by /usr/local/bin/rake
#
# ------------------------------+---------------------+----------+----------+------------+--------------------
# COLUMN_NAME                   | DATA_TYPE           | NULL? | KEY | DEFAULT | EXTRA
# ------------------------------+---------------------+----------+----------+------------+--------------------
# id                            | bigint(20)          | false    | PRI      |            | auto_increment
# uid                           | varchar(8)          | false    | UNI      |            | 
# nom                           | varchar(100)        | true     |          |            | 
# prenom                        | varchar(100)        | true     |          |            | 
# etablissement                 | varchar(100)        | true     |          |            | 
# classe                        | varchar(45)         | true     |          |            | 
# sexe                          | char(1)             | true     |          |            | 
# ------------------------------+---------------------+----------+----------+------------+--------------------
#
class Carnets < Sequel::Model(:carnets)

  # Plugins
  plugin :validation_helpers
  plugin :json_serializer
  plugin :composition

  # Referential integrity
  one_to_many :entrees
  one_to_many :rights

  # Not nullable cols and unicity validation
  def validate
    super
    validates_presence [:uid]
    validates_unique :uid
  end
end
