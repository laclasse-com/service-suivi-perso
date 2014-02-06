#coding: utf-8
#
# model for 'carnets' table
# generated 2014-02-06 10:24:32 +0100 by /usr/local/bin/rake
#
# ------------------------------+---------------------+----------+----------+------------+--------------------
# COLUMN_NAME                   | DATA_TYPE           | NULL? | KEY | DEFAULT | EXTRA
# ------------------------------+---------------------+----------+----------+------------+--------------------
# id                            | bigint(20)          | false    | PRI      |            | auto_increment
# uid                           | varchar(8)          | false    | UNI      |            | 
# ------------------------------+---------------------+----------+----------+------------+--------------------
#
class Carnets < Sequel::Model(:carnets)

  # Plugins
  plugin :validation_helpers
  plugin :json_serializer
  plugin :composition

  # Referential integrity
  one_to_many :entrees
  one_to_many :rigths

  # Not nullable cols and unicity validation
  def validate
    super
    validates_presence [:uid]
    validates_unique :uid
  end
end
