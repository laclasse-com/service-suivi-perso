#coding: utf-8
#
# model for 'onglets' table
# generated 2014-12-05 14:02:40 +0100 by /usr/local/bin/rake
#
# ------------------------------+---------------------+----------+----------+------------+--------------------
# COLUMN_NAME                   | DATA_TYPE           | NULL? | KEY | DEFAULT | EXTRA
# ------------------------------+---------------------+----------+----------+------------+--------------------
# id                            | bigint(20)          | false    | PRI      |            | auto_increment
# nom                           | varchar(45)         | false    |          |            | 
# uid_own                       | varchar(8)          | false    |          |            | 
# date_creation                 | timestamp           | true     |          |            | 
# url_publique                  | varchar(2000)       | true     |          |            | 
# ------------------------------+---------------------+----------+----------+------------+--------------------
#
class Onglets < Sequel::Model(:onglets)

  # Plugins
  plugin :validation_helpers
  plugin :json_serializer
  plugin :composition

  # Referential integrity
  one_to_many :carnets_onglets
  one_to_many :entrees_onglets

  # Not nullable cols and unicity validation
  def validate
    super
    validates_presence [:nom, :uid_own]
    validates_unique :id
  end
end
