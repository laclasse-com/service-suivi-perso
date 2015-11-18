# coding: utf-8

require 'csv'
require 'tempfile'
# API pour l'interface des stats
class StatsApi < Grape::API
  format :json
  content_type :json, 'application/json'

  helpers Laclasse::Helpers::User

  desc 'récupère le nombre de carnet par classe'
  params do
  end
  get '/' do
    stats = []
    user[:user_detailed]['classes'].uniq { |classe| [classe['classe_id'], classe['etablissement_code']] }.each do |cls|
      classe = {
        id: cls['classe_id'],
        nom: cls['classe_libelle'],
        nb_carnets: [],
        carnets: []
      }

      response = Laclasse::CrossApp::Sender.send_request_signed(:service_annuaire_regroupement, cls['classe_id'].to_s, 'expand' => 'true')
      carnets = CarnetsLib.carnets_de_la_classe(response)[:carnets]
      classe[:nb_carnets] = carnets.size

      carnets.each do |c|
        classe[:carnets].push(            id: c[:id],
                                          nom: c[:lastName].capitalize + ' ' + c[:firstName].capitalize,
                                          nb_messages: Saisies.where(carnets_id: c[:id]).count,
                                          nb_interloc: Saisies.where(carnets_id: c[:id]).distinct(:uid).count)
      end

      i = stats.index { |etab| etab[:etab_id] == cls['etablissement_code'] } unless stats.empty?
      if i
        stats[i][:classes].push classe
      else
        stat = {
          etab_id: cls['etablissement_code'],
          etab_nom: cls['etablissement_nom'],
          classes: []
        }
        stat[:classes].push classe
        stats.push(stat)
      end
    end

    { stats: stats }
  end

  desc 'récupère le csv'
  params do
  end
  get '/csv' do
    csv_string = CSV.generate do |csv|
      csv << ['nom élève', 'prénom élève', 'établissement', 'classe', 'nombre onglets', 'nombre messages', 'nombre interlocuteurs']
      user[:user_detailed]['classes'].uniq { |classe| [classe['classe_id'], classe['etablissement_code']] }.each do |cls|
        response = Laclasse::CrossApp::Sender.send_request_signed(:service_annuaire_regroupement, cls['classe_id'].to_s, 'expand' => 'true')
        carnets = CarnetsLib.carnets_de_la_classe(response)[:carnets]
        carnets.each do |c|
          nb_onglets = CarnetsOnglets.where(carnets_id: c[:id]).count
          nb_messages = Saisies.where(carnets_id: c[:id]).count
          nb_interloc = Saisies.where(carnets_id: c[:id]).distinct(:uid).count
          csv << [c[:lastName].capitalize, c[:firstName].capitalize, cls['etablissement_nom'], cls['classe_libelle'], nb_onglets, nb_messages, nb_interloc]
        end
      end
    end

    content_type 'text/csv'
    header['Content-Disposition'] = "attachment; filename='Statistiques_suivi_perso.csv'"
    header['Content-Length'] = csv_string.size
    env['api.format'] = :binary
    csv_string
  end

  desc 'récupère le nombre de carnet par classe pour evignal'
  params do
  end
  get '/evignal' do
    stats = []
    classes = []
    classes_evignal = user[:user_detailed]['classes'].uniq { |classe| [classe['classe_id'], classe['etablissement_code']] }
    carnets = CarnetsLib.carnets_evignal

    carnets.each do |c|
      carnet = {
        id: c[:id],
        nom: c[:lastName].capitalize + ' ' + c[:firstName].capitalize,
        nb_messages: Saisies.where(carnets_id: c[:id]).count,
        nb_interloc: Saisies.where(carnets_id: c[:id]).distinct(:uid).count
      }

      index_classe_evignal = classes_evignal.index { |classe| classe['classe_id'] == c[:classe_id] } unless classes_evignal.empty?
      if index_classe_evignal
        nom_classe = classes_evignal[index_classe_evignal]['classe_libelle']
      else
        nom_classe = 'Autres classes'
      end

      index_classe = classes.index { |classe| classe[:id] == c[:classe_id] || (classe[:nom] == nom_classe && nom_classe == 'Autres classes') } unless classes.empty?
      if index_classe
        classes[index_classe][:nb_carnets] = classes[index_classe][:nb_carnets] + 1
        classes[index_classe][:carnets].push(carnet)
      else
        classes.push(            id: c[:classe_id],
                                 etab_id: c[:etablissement_code],
                                 nom: nom_classe,
                                 nb_carnets: 1,
                                 carnets: [carnet])
      end
    end
    classes.each do |classe|
      index_classe_evignal = classes_evignal.index { |cls| cls['etablissement_code'] == classe[:etab_id] } unless classes_evignal.empty?
      if index_classe_evignal
        nom_etab = classes_evignal[index_classe_evignal]['etablissement_nom']
      else
        nom_etab = 'Autres établissements'
      end

      i = stats.index { |etab| etab[:etab_id] == classe[:etab_id] || (etab[:etab_nom] == nom_etab && nom_etab == 'Autres établissements') } unless stats.empty?
      if i
        stats[i][:classes].push classe
      else
        stats.push(            etab_id: classe[:etab_id],
                               etab_nom: nom_etab,
                               classes: [classe])
      end
    end
    {stats: stats}
  end

  desc 'récupère le csv pour evignal'
  params do
  end
  get '/evignal/csv' do
    csv_string = CSV.generate do |csv|
      csv << ['nom élève', 'prénom élève', 'établissement', 'classe', 'nombre onglets', 'nombre messages', 'nombre interlocuteurs']
      classes_evignal = user[:user_detailed]['classes'].uniq { |classe| [classe['classe_id'], classe['etablissement_code']] }
      carnets = CarnetsLib.carnets_evignal
      carnets.each do |c|
        nb_onglets = CarnetsOnglets.where(carnets_id: c[:id]).count
        nb_messages = Saisies.where(carnets_id: c[:id]).count
        nb_interloc = Saisies.where(carnets_id: c[:id]).distinct(:uid).count
        index_classe_evignal = classes_evignal.index { |classe| classe['classe_id'] == c[:classe_id] } unless classes_evignal.empty?
        if index_classe_evignal
          nom_classe = classes_evignal[index_classe_evignal]['classe_libelle']
        else
          nom_classe = 'Autres classes'
        end
        index_classe_evignal = classes_evignal.index { |cls| cls['etablissement_code'] == c[:etablissement_code] } unless classes_evignal.empty?
        if index_classe_evignal
          nom_etab = classes_evignal[index_classe_evignal]['etablissement_nom']
        else
          nom_etab = 'Autres établissements'
        end
        csv << [c[:lastName].capitalize, c[:firstName].capitalize, nom_etab, nom_classe, nb_onglets, nb_messages, nb_interloc]
      end
    end

    content_type 'text/csv'
    header['Content-Disposition'] = "attachment; filename='Statistiques_suivi_perso.csv'"
    header['Content-Length'] = csv_string.size
    env['api.format'] = :binary

    csv_string
  end
end
