# coding: utf-8

class Saisie < Sequel::Model(:saisies)
  plugin :validation_helpers
  plugin :json_serializer
  plugin :composition

  many_to_one :onglets
  one_to_many :ressources
end
