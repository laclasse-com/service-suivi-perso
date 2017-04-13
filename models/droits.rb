# coding: utf-8

class Droit < Sequel::Model(:droits)
  many_to_one :carnets
  many_to_one :onglets
  many_to_one :saisies
end
