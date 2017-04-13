class Ressource < Sequel::Model(:ressources)
  plugin :validation_helpers
  plugin :json_serializer
  plugin :composition

  many_to_one :saisies
end
