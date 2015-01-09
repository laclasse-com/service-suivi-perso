#coding: utf-8
#
# model for 'docs' table
# generated 2015-01-08 14:04:17 +0100 by /usr/local/bin/rake
#
# ------------------------------+---------------------+----------+----------+------------+--------------------
# COLUMN_NAME                   | DATA_TYPE           | NULL? | KEY | DEFAULT | EXTRA
# ------------------------------+---------------------+----------+----------+------------+--------------------
# id                            | bigint(20)          | false    | PRI      |            | auto_increment
# nom                           | varchar(250)        | false    |          |            | 
# url                           | varchar(2000)       | false    |          |            | 
# saisies_id                    | bigint(20)          | false    | MUL      |            | 
# ------------------------------+---------------------+----------+----------+------------+--------------------
#
class Docs < Sequel::Model(:docs)

  # Plugins
  plugin :validation_helpers
  plugin :json_serializer
  plugin :composition

  # Referential integrity
  many_to_one :saisies

  # Not nullable cols and unicity validation
  def validate
    super
    validates_presence [:nom, :url, :saisies_id]
    validates_unique :id
  end
end
