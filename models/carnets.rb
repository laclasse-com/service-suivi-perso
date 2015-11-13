# coding: utf-8
#
# model for 'carnets' table
# generated 2014-11-18 12:57:57 +0100 by /usr/local/bin/rake
#
# ------------------------------+---------------------+----------+----------+------------+--------------------
# COLUMN_NAME                   | DATA_TYPE           | NULL? | KEY | DEFAULT | EXTRA
# ------------------------------+---------------------+----------+----------+------------+--------------------
# id                            | bigint(20)          | false    | PRI      |            | auto_increment
# uid_elv                       | varchar(8)          | false    | UNI      |            |
# uid_adm                       | varchar(8)          | false    |          |            |
# uai                           | varchar(8)          | false    |          |            |
# cls_id                        | bigint(20)          | false    |          |            |
# evignal                       | tinyint(1)          | false    |          | 0          |
# url_publique                  | varchar(2000)       | true     |          |            |
# date_creation                 | timestamp           | true     |          |            |
# droits_pre                    | int(11)             | true     |          | 0          |
# droits_elv                    | int(11)             | true     |          | 0          |
# droits_pen                    | int(11)             | true     |          | 0          |
# ------------------------------+---------------------+----------+----------+------------+--------------------
#
class Carnets < Sequel::Model(:carnets)
  # Plugins
  plugin :validation_helpers
  plugin :json_serializer
  plugin :composition

  # Referential integrity
  one_to_many :carnets_onglets
  one_to_many :droits_specifiques
  one_to_many :saisies

  # Not nullable cols and unicity validation
  def validate
    super
    validates_presence [:uid_elv, :uid_adm, :uai, :cls_id]
    validates_unique :uid_elv
  end
end
