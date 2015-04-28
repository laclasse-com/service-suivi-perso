# -*- encoding: utf-8 -*-
require 'base64'
require 'cgi'
# openssl is better than ruby-hmac and we can use sha2 instead for encrypting
# require 'hmac-sha1'
require 'openssl'
require 'net/http'

# VARIABLE GLOBAL DE L'UTILISATEUR COURANT
$current_user = nil

# helper pour les fonctions d'authentification et d'utilisateur connecté.
module AuthenticationHelpers
  #
  # Getter sur les infos de la session
  #
  def get_current_user
    return nil if env['rack.session'][:current_user].nil?
    $current_user ||= env['rack.session'][:current_user]
  end

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
