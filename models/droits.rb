# coding: utf-8

class Droit < Sequel::Model(:droits)
  # Plugins
  plugin :validation_helpers
  plugin :json_serializer
  plugin :composition

  # Referential integrity
  many_to_one :carnets
end
