# # encoding: utf-8
# # -*- coding: utf-8 -*-

# require 'base64'
# require 'cgi'
# require 'openssl'

# require_relative '../config/constants'
# require_relative '../lib/carnets'

# # Module d'interfaçage avec l'annuaire
# module Annuaire
#   module_function

#   #signe une requête 
#   def sign( uri, service, args, secret_key, app_id )
#     timestamp = Time.now.getutc.strftime('%FT%T')
#     canonical_string = "#{uri}/#{service}?"

#     canonical_string += Hash[ args.sort ].map { |key, value| "#{key}=#{CGI.escape(value)}" }.join( '&' )
#     canonical_string += ";#{timestamp};#{app_id}"

#     digest = OpenSSL::Digest::Digest.new( 'sha1' )
#     digested_message = Base64.encode64( OpenSSL::HMAC.digest( digest, secret_key, canonical_string ) )

#     query = args.map { |key, value| "#{key}=#{CGI.escape(value)}" }.join( '&' )

#     signature = { app_id: app_id,
#                   timestamp: timestamp,
#                   signature: digested_message }.map { |key, value| "#{key}=#{CGI.escape(value)}" }.join( ';' ).chomp

#     "#{uri}/#{service}?#{query};#{signature}"
#   end

#   #envoie une requête 
#   def send_request_signed(url, service, args)
#     RestClient.get( sign(url, service, args, ANNUAIRE[:secret], ANNUAIRE[:app_id] ),  ) do
#       |response, request, result|
#       if response.code == 200
#         return JSON.parse( response )
#       else
#         STDERR.puts 'URL fautive: ' + sign(url, service, args, ANNUAIRE[:secret], ANNUAIRE[:app_id] ) + '  Code : ' + response.code.to_s
#         return nil
#       end
#     end
#   end

#   #retourne les informations de l'annuaire pour un utilisateur
#   def get_info_annuaire_of(uid)
#     response = send_request_signed(ANNUAIRE[:url], ANNUAIRE[:service_user] + uid.to_s, {"expand" => "true"})
#   end

#   #retourne les infos sur plusieurs utilisateurs.
#   def get_users_info_of(uids)
#     #on transforme la liste d'UIDS en chaines de caractères pour effectuer la requête
#     list_uid = ""
#     uids.each do |uid|
#       if list_uid.empty?
#         list_uid += uid.to_s
#       else
#         list_uid += ";"+uid.to_s
#       end
#     end
#     return send_request_signed(ANNUAIRE[:url], ANNUAIRE[:service_users] + list_uid, {})
#   end

#   #récupère tous les regroupements pour un utilisateurs
#   def get_regroupements_of(uid)
#     response = get_info_annuaire_of uid
#     response = {"etablissements" => [], "classes" => [], "groupes_eleves" => []} if response.nil?
#     etablissements = []
#     classes =[]
#     groupes = []
#     response["etablissements"].each do |etab|
#       etablissements.push(hash_regroupement(etab["id"],etab["nom"], nil)) if !etablissements.include?(hash_regroupement(etab["id"],etab["nom"], nil))
#     end
#     response["classes"].each do |classe|
#       classes.push hash_regroupement(classe["classe_id"], classe["classe_libelle"], classe["etablissement_id"]) if !classes.include?(hash_regroupement(classe["classe_id"], classe["classe_libelle"], classe["etablissement_id"]))
#     end
#     response["groupes_eleves"].each do |groupe|
#       groupes.push hash_regroupement(groupe["groupe_id"], groupe["groupe_libelle"], groupe["etablissement_id"]) if !groupes.include?(hash_regroupement(groupe["groupe_id"], groupe["groupe_libelle"], groupe["etablissement_id"]))
#     end
#     regroupements = liste_regroupements etablissements, classes, groupes 
#     CarnetsLib.couleurs_carnets(regroupements, false)
#   end

#   #récupère tous les carnets lié à un utilisateur dans la base
#   def get_list_carnets_of(uid)
#     carnetsIds = []
#     Rights.where(:uid => uid).each do |right|
#       carnetsIds.push right.carnets_id
#     end
#     CarnetsLib.list_carnets(carnetsIds)
#   end

#   #recherche tous les carnets créé pour un regroupement
#   def get_carnets_regroupement_of(uid, id_rgrp)
#     carnets = []
#     regroupement = send_request_signed(ANNUAIRE[:url], ANNUAIRE[:service_regroupement] + id_rgrp.to_s, {"expand" => "true"})
#     if !regroupement.nil?
#       eleves = regroupement["eleves"]
#       eleves.each do |eleve|
#         if CarnetsLib.rights_on(eleve["id_ent"], uid)
#           carnets.push CarnetsLib.get_carnet_of(Carnets[:uid => eleve["id_ent"]].id)
#         end
#       end
#     end
#     carnets
#   end

#   #retourne un hash d'un regroupements avec son id et son nom
#   def hash_regroupement(id, nom, etab_id)
#     {
#       :id => id,
#       :nom => nom,
#       :etab_id => etab_id
#     }
#   end

#   #retourne un etablissement avec ses classes et ses groupes
#   def regroupements_with_etabName(etab, rgrpnt)
#     regroupement = {}
#     regroupement[:id] = rgrpnt[:id]
#     regroupement[:nom] = rgrpnt[:nom]
#     regroupement[:etab_nom] = etab[:nom]
#     regroupement[:etab_id] = etab[:id]
#     regroupement[:color] =''
#     regroupement
#   end

#   #retourne une liste d'établissement avec ses classe et ses groupes
#   def liste_regroupements(etabs, classes, groupes)
#     regroupements = []
#     etabs.each do |etab|
#       classes.each do |classe|
#         regroupements.push regroupements_with_etabName(etab, classe) if classe[:etab_id] == etab[:id]
#       end
#       groupes.each do |groupe|
#         regroupements.push regroupements_with_etabName(etab, groupe) if groupe[:etab_id] == etab[:id]
#       end
#     end
#     regroupements
#   end

#   #TODO
#   #vérifie si l'uid est un administrateur
#   def checkAdmin(uid, id_etab)
#     response = get_info_annuaire_of uid
#     check = false
#     if !response.nil?
#       profiles = modify_PROFIL
#       response["roles"].each do |role|
#         if role["etablissement_id"] == id_etab && profiles[role["role_id"]] >= "3"
#           check = true
#         end
#       end
#     end
#     check
#   end

#   #transforme la constante PROFILE pour une recherche par valeur
#   def modify_PROFIL
#     profiles = {}
#     PROFIL.values.each do |profil|
#       profiles[profil[:value]]=profil[:coeff]
#     end
#     profiles
#   end
# end