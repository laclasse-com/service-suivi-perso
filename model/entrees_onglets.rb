#coding: utf-8
#
# model for 'entrees_onglets' table
# generated 2014-08-29 12:29:18 +0200 by /usr/local/bin/rake
#
# ------------------------------+---------------------+----------+----------+------------+--------------------
# COLUMN_NAME                   | DATA_TYPE           | NULL? | KEY | DEFAULT | EXTRA
# ------------------------------+---------------------+----------+----------+------------+--------------------
# saisies_id                    | bigint(20)          | false    | PRI      |            | 
# onglets_id                    | bigint(20)          | false    | PRI      |            | 
# ------------------------------+---------------------+----------+----------+------------+--------------------
#
class EntreesOnglets < Sequel::Model(:entrees_onglets)

  # Plugins
  plugin :validation_helpers
  plugin :json_serializer
  plugin :composition

  # Referential integrity
  many_to_one :saisies
  many_to_one :onglets

  # Not nullable cols and unicity validation
  def validate
    super
  end
end
