class Carnet < Sequel::Model(:carnets)
  one_to_many :onglets

  def self.of( uid_eleve )
    carnet = Carnet[uid_eleve: uid_eleve]
    if carnet.nil?
      # FIXME: check that uid_eleve is actually an eleve
      carnet = Carnet.create( uid_eleve: uid_eleve,
                              ctime: Time.now )
    end

    carnet
  end

  def before_destroy
    Onglet.where(onglet_id: id).destroy
  end

  def to_json( arg )
    h = to_hash
    h[:ctime] = DateTime.parse( h[:ctime].to_s ) unless h[:ctime].nil? # rubocop:disable Style/DateTime

    h.to_json( arg )
  end
end
