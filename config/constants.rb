# Liste des constantes de l'application
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

# Gestion des droits
COEFF = {
  'user' => '5',
  'TECH' => '4',
  'ADM_ETB' => '3',
  'DIR_ETB' => '2',
  'AVS_ETB' => '1',
  'CPE_ETB' => '1',
  'PROF_ETB' => '1',
  'PAR_ETB' => '0',
  'ELV_ETB' => '0',
  '' => '-1'
}

ROLES = {
  super_admin: 'TECH',
  admin: 'ADM_ETB',
  principal: 'DIR_ETB',
  assistante_vie_scolaire: 'AVS_ETB',
  cpe: 'CPE_ETB',
  prof: 'PROF_ETB',
  parents: 'PAR_ETB',
  eleve: 'ELV_ETB',
  default: ''
}
