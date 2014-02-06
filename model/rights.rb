#coding: utf-8
#
# model for 'rights' table
# generated 2014-02-06 10:29:35 +0100 by /usr/local/bin/rake
#
# ------------------------------+---------------------+----------+----------+------------+--------------------
# COLUMN_NAME                   | DATA_TYPE           | NULL? | KEY | DEFAULT | EXTRA
# ------------------------------+---------------------+----------+----------+------------+--------------------
# id                            | int(11)             | false    | PRI      |            | auto_increment
# uid                           | varchar(8)          | false    | UNI      |            | 
# read                          | binary(1)           | true     |          | 0          | 
# write                         | binary(1)           | true     |          | 0          | 
# carnets_id                    | bigint(20)          | false    | PRI      |            | 
# ------------------------------+---------------------+----------+----------+------------+--------------------
#
class Rights < Sequel::Model(:rights)

  # Plugins
  plugin :validation_helpers
  plugin :json_serializer
  plugin :composition

  # Referential integrity
  many_to_one :carnets

  # Not nullable cols and unicity validation
  def validate
    super
    validates_presence [:uid]
    validates_unique :id, :uid
  end
end
