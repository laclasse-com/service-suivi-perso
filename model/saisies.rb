# coding: utf-8
#
# model for 'saisies' table
# generated 2014-09-25 14:32:04 +0200 by /usr/local/bin/rake
#
# ------------------------------+---------------------+----------+----------+------------+--------------------
# COLUMN_NAME                   | DATA_TYPE           | NULL? | KEY | DEFAULT | EXTRA
# ------------------------------+---------------------+----------+----------+------------+--------------------
# id                            | bigint(20)          | false    | PRI      |            | auto_increment
# uid                           | varchar(8)          | false    |          |            |
# date_creation                 | timestamp           | true     |          |            |
# contenu                       | text                | true     |          |            |
# carnets_id                    | bigint(20)          | false    | MUL      |            |
# date_modification             | datetime            | true     |          |            |
# infos_owner                   | varchar(250)        | false    |          |            |
# avatar                        | varchar(200)        | false    |          |            |
# avatar_color                  | varchar(200)        | false    |          |            |
# back_color                    | varchar(200)        | false    |          |            |
# ------------------------------+---------------------+----------+----------+------------+--------------------
#
class Saisies < Sequel::Model(:saisies)
  # Plugins
  plugin :validation_helpers
  plugin :json_serializer
  plugin :composition

  # Referential integrity
  many_to_one :carnets
  one_to_many :entrees_onglets

  # Not nullable cols and unicity validation
  def validate
    super
    validates_presence [:uid, :carnets_id, :infos_owner, :avatar, :avatar_color, :back_color]
    validates_unique :id
  end
end
