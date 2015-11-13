# -*- encoding: utf-8 -*-
require 'base64'
require 'cgi'
# openssl is better than ruby-hmac and we can use sha2 instead for encrypting
# require 'hmac-sha1'
require 'openssl'
require 'net/http'

# helper pour les fonctions d'authentification et d'utilisateur connecté.
module URLHelpers
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
