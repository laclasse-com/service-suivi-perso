# coding: utf-8

class Ressource < Sequel::Model(:ressources)
  # Plugins
  plugin :validation_helpers
  plugin :json_serializer
  plugin :composition

  # Referential integrity
  many_to_one :saisies, class: :Saisie, key: :saisie_id
end
