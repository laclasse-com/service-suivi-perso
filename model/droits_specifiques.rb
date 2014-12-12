#coding: utf-8
#
# model for 'droits_specifiques' table
# generated 2014-11-20 11:43:21 +0100 by /usr/local/bin/rake
#
# ------------------------------+---------------------+----------+----------+------------+--------------------
# COLUMN_NAME                   | DATA_TYPE           | NULL? | KEY | DEFAULT | EXTRA
# ------------------------------+---------------------+----------+----------+------------+--------------------
# id                            | bigint(20)          | false    | PRI      |            | auto_increment
# uid                           | varchar(8)          | false    |          |            | 
# read                          | int(11)             | true     |          | 0          | 
# write                         | int(11)             | true     |          | 0          | 
# carnets_id                    | bigint(20)          | false    | MUL      |            | 
# date_creation                 | timestamp           | true     |          |            | 
# full_name                     | varchar(200)        | false    |          |            | 
# profil                        | varchar(45)         | false    |          |            | 
# admin                         | int(11)             | true     |          | 0          | 
# hopital                       | tinyint(1)          | false    |          | 0          | 
# evignal                       | tinyint(1)          | false    |          | 0          | 
# ------------------------------+---------------------+----------+----------+------------+--------------------
#
class DroitsSpecifiques < Sequel::Model(:droits_specifiques)

  # Plugins
  plugin :validation_helpers
  plugin :json_serializer
  plugin :composition

  # Referential integrity
  many_to_one :carnets

  # Not nullable cols and unicity validation
  def validate
    super
    validates_presence [:uid, :carnets_id, :full_name, :profil]
    validates_unique :id
  end
end
