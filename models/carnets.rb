# coding: utf-8

class Carnet < Sequel::Model(:carnets)
  plugin :validation_helpers
  plugin :json_serializer
  plugin :composition

  one_to_many :onglets
  one_to_many :droits
  one_to_many :saisies
end
