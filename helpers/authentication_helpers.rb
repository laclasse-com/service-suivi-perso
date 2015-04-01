# -*- encoding: utf-8 -*-
require 'base64'
require 'cgi'
# openssl is better than ruby-hmac and we can use sha2 instead for encrypting
# require 'hmac-sha1'
require 'openssl'
require 'net/http'

# VARIABLE GLOBAL DE L'UTILISATEUR COURANT
$current_user = nil

module AuthenticationHelpers
  # def is_logged?
  #   env['rack.session'][:authenticated]
  # end

  # #
  # # Log l'utilisateur puis redirige vers 'auth/:provider/callback' qui se charge
  # #   d'initialiser la session et de rediriger vers l'url passée en paramètre
  # #
  # def login!( route = "" )
  #   if !route.empty?
  #     route += "?" + env['QUERY_STRING'] if !env['QUERY_STRING'].empty?
  #     route = URI.escape(env['rack.url_scheme'] + "://" + env['HTTP_HOST'] + route)
  #     redirect  APP_PATH + "/auth/cas?url=#{URI.encode( route )}"
  #   end
  #   redirect APP_PATH + "/auth/cas"
  # end

  # #
  # # Délogue l'utilisateur du serveur CAS et de l'application
  # #
  # def logout!( url = "" )
  #   env['rack.session'][:authenticated] = false
  #   env['rack.session'][:current_user] = nil

  #   CAS::CONFIG[:ssl] ? protocol = 'https://' : protocol = 'http://'
  #   redirect protocol + CAS::CONFIG[:host] + CAS::CONFIG[:logout_url] + '?url=' + URI.encode( url )
  # end

  #
  # récupération des données envoyée par CAS
  #
  # def set_current_user( env )
  #   env['rack.session'][:current_user] = { user: nil, info: nil }
  #   if env['rack.session'][:user]
  #     env['rack.session'][:current_user][:user] ||= env['rack.session'][:user]
  #     env['rack.session'][:current_user][:info] ||= env['rack.session'][:extra]
  #     env['rack.session'][:current_user][:info][:ENTStructureNomCourant] ||= env['rack.session'][:current_user][:extra][:ENTPersonStructRattachRNE]
  #   end
  #   env['rack.session'][:current_user]
  # end

  #
  # Getter sur les infos de la session
  #
  def get_current_user
    return nil if env['rack.session'][:current_user].nil?
    $current_user ||= env['rack.session'][:current_user]
  end

  # #
  # # Initialisation de la session après l'authentification
  # #
  # def init_session( env )
  #   puts "------------------------- init sesison-------------------------"
  #   if env['rack.session']
  #     env['rack.session'][:user] = env['omniauth.auth'].extra.user
  #     puts (env['omniauth.auth'].extra).inspect
  #     env['rack.session'][:extra] = env['omniauth.auth'].extra
  #     session[:authenticated] = true
  #     session[:ep_sessions] = {}
  #   end
  #   set_current_user env
  # end

  # Vérifier la validité du jeton XML envoyé par CAS : du type XXX99999
  def is_uid_valid?
    valid = true
    valid = false unless env['rack.session'][:current_user][:info][:uid]
    valid = false if  env['rack.session'][:current_user][:info][:uid].match(/[a-z]{3}[0-9]{5}/i).nil?
    valid = false unless env['rack.session'][:current_user][:info][:user]
    valid = false unless env['rack.session'][:current_user][:info][:info].ENTPersonStructRattachRNE
    valid = false if  env['rack.session'][:current_user][:info][:info].ENTPersonStructRattachRNE.match(/[0-9]{7}[a-z]{1}/i).nil?
    valid
  end

  # def authenticate(request)
  #   # get the list of all parameters
  #   parameters = request.query_string()

  #   principal_parameters = request.params

  #   timestamp = principal_parameters["timestamp"]

  #   signature = principal_parameters["signature"]

  #   app_id = principal_parameters["app_id"]

  #   app_key = ANNUAIRE[:api_key]

  #   principal_parameters.reject! {|k,v| (k == "app_id" || k == "timestamp" || k == "signature" || k == "route_info" )}

  #   # rebuild string
  #   canonical_string = url(request) + '?'
  #   canonical_string += Hash[principal_parameters.sort].collect{|key, value| [key.to_s, CGI::escape(value.to_s)].join('=')}.join('&')
  #   canonical_string += ';'
  #   canonical_string += timestamp
  #   canonical_string += ';'
  #   canonical_string += app_id

  #   #puts "application key in database"
  #   #puts app_key.application_key

  #   #puts "calculated canonical string"
  #   #puts canonical_string

  #   ## resign messsage
  #   digest = OpenSSL::Digest.new('sha1')
  #   signed_message = Base64.encode64(OpenSSL::HMAC.digest(digest, app_key.chomp, canonical_string))

  #   if signature == signed_message
  #     return true
  #   else
  #     return false
  #   end
  # end

  # returns uri of the rack request
  def url(request)
    url = request.scheme + '://'
    url << request.host
    if request.scheme == 'https' && request.port != 443 ||
       request.scheme == 'http' && request.port != 80
      url << ":#{request.port}"
    end

    url << request.path
    url
  end
end
