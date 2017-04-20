# coding: utf-8

class Saisie < Sequel::Model(:saisies)
  many_to_one :onglets, class: :Onglet, key: :onglet_id
  one_to_many :ressources

  def before_destroy
    Ressource.where(saisie_id: id).destroy
  end

  def to_json( arg )
    h = to_hash
    h[:date_creation] = DateTime.parse( h[:date_creation].to_s ) unless h[:date_creation].nil?
    h[:date_modification] = DateTime.parse( h[:date_modification].to_s ) unless h[:date_modification].nil?

    h.to_json( arg )
  end
end
