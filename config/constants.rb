# Liste des constants de l'application
require 'logger'
URL_REQUEST_TEST = ''

LOGGER = Logger.new(STDOUT)

COLOR = {
  rouge: '#EB5454',
  bleu: '#1AA1CC',
  violet: '#9C75AB',
  jaune: '#E8C254',
  vert: '#80BA66'
}

ANNUAIRE_URL = {
  suivi_perso_search: 'eleves/search/',
  user_liste: 'liste/'
}

# Couleurs des carnets sur 16 cases
PANEL_COLOR = [COLOR[:bleu], COLOR[:jaune], COLOR[:violet], COLOR[:vert],
               COLOR[:rouge], COLOR[:vert], COLOR[:bleu], COLOR[:jaune],
               COLOR[:violet], COLOR[:bleu], COLOR[:jaune], COLOR[:rouge],
               COLOR[:jaune], COLOR[:rouge], COLOR[:vert], COLOR[:bleu]
              ]

AVATAR = {
  F: '/app/bower_components/laclasse-common-client/images/avatar_feminin.svg',
  M: '/app/bower_components/laclasse-common-client/images/avatar_masculin.svg'
}
UAI_EVIGNAL = '0692165D'
MAIL_DOMAINE = '@laclasse.com'
