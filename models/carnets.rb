# coding: utf-8

class Carnet < Sequel::Model(:carnets)
  one_to_many :onglets

  def self.of( uid_eleve )
    carnet = Carnet[ uid_eleve: uid_eleve ]
    if carnet.nil?
      # FIXME: check that uid_eleve is actually an eleve
      carnet = Carnet.create( uid_eleve: uid_eleve,
                              date_creation: DateTime.now )
    end

    carnet
  end

  def before_destroy
    Onglet.where(onglet_id: id).destroy
  end

  def to_json( arg )
    h = to_hash
    h[:date_creation] = DateTime.parse( h[:date_creation].to_s ) unless h[:date_creation].nil?

    h.to_json( arg )
  end
end
