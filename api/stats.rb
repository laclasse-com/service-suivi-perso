#coding: utf-8

require 'csv'
require 'tempfile'
# API pour l'interface des stats
class StatsApi < Grape::API
	format :json
  content_type :json, "application/json"

  desc 'récupère le nombre de carnet par classe'
  params{
  }
  get '/' do
    begin
      stats = {:carnets_classe => [], :message_carnet => [], :interloc_carnet => []}
      $current_user[:user_detailed]['classes'].each do |classe|
        carnets = Carnets.where(:cls_id => classe["classe_id"])
        nb_carnets = carnets.count
        stats[:carnets_classe].push({classe: classe["classe_libelle"], nb_carnets: nb_carnets})
        carnets.each do |carnet|
          nb_messages = Saisies.where(:carnets_id => carnet.id).count
          nb_interloc = Saisies.where(:carnets_id => carnet.id).distinct(:uid).count
          stats[:message_carnet].push({carnet: carnet.id, nb_messages: nb_messages})
          stats[:interloc_carnet].push({carnet: carnet.id, nb_interloc: nb_interloc})
        end
      end
      stats
    rescue Exception => e
      puts e.message
      {error: "Impossible de récupérer le nombre de carnet par classe"}
    end
  end

  desc 'récupère le csv'
  params{
  }
  get '/csv' do
    begin
      # file_csv = Tempfile.new('Statistiques_suivi_perso.csv')

      csv_string = CSV.generate do |csv|
        csv << ["row", "of", "CSV", "data"]
        csv << ["another", "row"]
      end

      # file_csv << csv_string

      content_type 'text/csv'
      header['Content-Disposition'] = "attachment; filename="+file_csv.basename
      header['Content-Length'] = file_csv.size
      env['api.format'] = :binary
      csv_string
    rescue Exception => e
      puts e.message
      {error: "Impossible de récupérer le csv"}
    # ensure
    #   file_csv.close
    #   file_csv.unlink
    end
  end
end