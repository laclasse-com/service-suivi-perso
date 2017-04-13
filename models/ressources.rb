class Ressource < Sequel::Model(:ressources)
  many_to_one :saisies
  many_to_one :onglets
end
