# coding: utf-8

class Droit < Sequel::Model(:droits)
  many_to_one :onglets
end
