# encoding: utf-8
# -*- coding: utf-8 -*-

require 'base64'
require 'cgi'
require 'openssl'

require_relative '../config/constants'
require_relative '../lib/carnets'

# Module d'interfaçage avec l'annuaire
module Annuaire
  module_function

  #signe une requête 
  def sign( uri, service, args, secret_key, app_id )
    timestamp = Time.now.getutc.strftime('%FT%T')
    canonical_string = "#{uri}/#{service}?"

    canonical_string += Hash[ args.sort ].map { |key, value| "#{key}=#{CGI.escape(value)}" }.join( '&' )
    canonical_string += ";#{timestamp};#{app_id}"

    digest = OpenSSL::Digest::Digest.new( 'sha1' )
    digested_message = Base64.encode64( OpenSSL::HMAC.digest( digest, secret_key, canonical_string ) )

    query = args.map { |key, value| "#{key}=#{CGI.escape(value)}" }.join( '&' )

    signature = { app_id: app_id,
                  timestamp: timestamp,
                  signature: digested_message }.map { |key, value| "#{key}=#{CGI.escape(value)}" }.join( ';' ).chomp

    "#{uri}/#{service}?#{query};#{signature}"
  end

  #envoie une requête 
  def send_request_signed(url, service, args)
    RestClient.get( sign(url, service, args, ANNUAIRE[:secret], ANNUAIRE[:app_id] ),  ) do
      |response, request, result|
      if response.code == 200
        return JSON.parse( response )
      else
        STDERR.puts 'URL fautive: ' + sign(url, service, args, ANNUAIRE[:secret], ANNUAIRE[:app_id] ) + '  Code : ' + response.code.to_s
        return nil
      end
    end
  end

  #retourne les informations de l'annuaire pour un utilisateur
  def get_info_annuaire_of(uid)
    response = send_request_signed(ANNUAIRE[:url], ANNUAIRE[:service_user] + uid.to_s, {"expand" => "true"})
  end

  #retourne les infos sur plusieurs utilisateurs.
  def get_users_info_of(uids)
    #on transforme la liste d'UIDS en chaines de caractères pour effectuer la requête
    list_uid = ""
    uids.each do |uid|
      if list_uid.empty?
        list_uid += uid.to_s
      else
        list_uid += ";"+uid.to_s
      end
    end
    return send_request_signed(ANNUAIRE[:url], ANNUAIRE[:service_users] + list_uid, {})
  end

  #récupère tous les carnets lié à un utilisateur dans la base
  def get_list_carnets_of(uid)
    carnetsIds = []
    Rights.where(:uid => uid).each do |right|
      carnetsIds.push right.carnets_id
    end
    CarnetsLib.list_carnets(carnetsIds)
  end
end