#coding: utf-8
#
# Fichier de configuration de l'application
#

# development ou production
ENV[ 'RACK_ENV' ]  = 'test'

# niveau de log de l'application
LOG_LEVEL = "" #Logger::INFO

# Chemin absolu de l'application sur le serveur
APP_ROOT = File.expand_path(File.join(File.dirname(__FILE__), '..'))

# Mapping HAProxy de l'application, ex : '/v3/docs'
APP_PATH = '/v3/suivi'	

# Langage par defaut de l'application
LANG = 'fr'	

# Clef de hachage pour les cookies Rack
SESSION_KEY = 'SomeKey'	

# Duree de la session en seconde (défaut 3600)
SESSION_TIME = 3600	

# Url de l'ENT
URL_ENT = 'http://www.dev.laclasse.com'

# nom du serveur d'annuaire ENT (xml-aaf academiques)
SERVICE_ANNUAIRE_ENT = 'http://www.dev.laclasse/com/annuaire/'

#
# Configuration du Serveur d'Authentification Central CAS
#
module CASAUTH 
  CONFIG = { 
  host: 'www.dev.laclasse.com',
  ssl: true,
  port: 443,
  disable_ssl_verification: true,
  login_url: '/sso-mysql/login',
  service_validate_url: '/sso-mysql/serviceValidate',
  logout_url: '/sso-mysql/logout',
  logout_saml_url: '/saml/saml2/idp/SingleLogoutService.php'
}
end

#
# Configuration du service d'annuaire de l'ENT
#
ANNUAIRE = { 
  url: 'http://www.dev.laclasse.com/api',
  app_id: 'SUIVIELV',
  api_key: '2b9r1HHkatMfvW3MljCtNZOWvBBbODigewZrPw5P6U8=',
  #api_mode: 'v2', 
  api_mode: 'v3', 
  # service_annuaire_user: '/pls/public/!ajax_server.service?serviceName=serviceApiUser&uid=' pour l'annuaire v2
  service_annuaire_user: 'app/users/',
  service_annuaire_user_liste: 'app/users/liste/',
  service_annuaire_regroupements: '/app/regroupements/'
}

#
# Configuration du service Etherpad
#
ETHERPAD = { 
  url: 'localhost:9001',
  api_key: 'A50vIgYTfFnxC1wSN22LpOBIqT7brCJB',
  default_text: 'Vous etes a present sur etherpad. \n Celui-ci est un document collaboratif. \n'
}

#
# Configuration du service de quizs
#
QUIZS = { 
  url: 'http://www.dev.laclasse.com',
  uri_open: '/pls/education/quizz.lance_exercice?p_exo_id=',
  uri_modif: '/pls/education/!page.laclasse?contexte=DOCUMENTS&paction=modifier_element&ptype=',
  api_key: 'Clef secrete de signature des echanges'
}

#
# Configuration du service de notifications
#

#NOTIFICATIONS = {
#      mount: '#{APP_PATH}/faye',
#      timeout: 25,
#      engine: {
#          host: 'http://www.laclasse.com',
#          type: Faye::Redis,
#          port: 6379
#      }
#}

# 
# Configuration du service REDIS
#
#REDIS = {
#      Host: 'http://www.laclasse.com',
#      port: 6379,
#      redis_root: 'com.laclasse.dev.'
#}

#
# Configuration du service de mail
#
MAIL = {
  adress: "smtp.laclasse.com",
  enable_starttls_auto: false,
  webmail_host: 'http://www.dev.laclasse.com/mail/'
}