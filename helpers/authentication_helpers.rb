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
  #
  # Getter sur les infos de la session
  #
  def get_current_user
    return nil if env['rack.session'][:current_user].nil?
    $current_user ||= env['rack.session'][:current_user]
  end

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
