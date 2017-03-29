# coding: utf-8

class Onglet < Sequel::Model(:onglets)
  # Plugins
  plugin :validation_helpers
  plugin :json_serializer
  plugin :composition

  # Referential integrity
  one_to_many :carnets
end
