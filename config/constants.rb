# Liste des constantes de l'application
require 'logger'

URL_REQUEST_TEST = ''.freeze

LOGGER = Logger.new(STDOUT)

COLOR = { rouge: '#EB5454',
          bleu: '#1AA1CC',
          violet: '#9C75AB',
          jaune: '#E8C254',
          vert: '#80BA66' }.freeze

ANNUAIRE_URL = { suivi_perso_search: 'eleves/search/',
                 user_liste: 'liste/' }.freeze

# Couleurs des carnets sur 16 cases
PANEL_COLOR = [ COLOR[:bleu], COLOR[:jaune], COLOR[:violet], COLOR[:vert],
                COLOR[:rouge], COLOR[:vert], COLOR[:bleu], COLOR[:jaune],
                COLOR[:violet], COLOR[:bleu], COLOR[:jaune], COLOR[:rouge],
                COLOR[:jaune], COLOR[:rouge], COLOR[:vert], COLOR[:bleu] ].freeze

AVATAR = { F: '/app/node_modules/laclasse-common-client/images/avatar_feminin.svg',
           M: '/app/node_modules/laclasse-common-client/images/avatar_masculin.svg' }.freeze

UAI_EVIGNAL = '0692165D'.freeze
MAIL_DOMAINE = '@laclasse.com'.freeze

# Gestion des droits
COEFF = { 'user' => '5',
          'TECH' => '4',
          'ADM_ETB' => '3',
          'DIR_ETB' => '2',
          'AVS_ETB' => '1',
          'CPE_ETB' => '1',
          'PROF_ETB' => '1',
          'PAR_ETB' => '0',
          'ELV_ETB' => '0',
          '' => '-1' }.freeze

ROLES = { super_admin: 'TECH',
          admin: 'ADM_ETB',
          principal: 'DIR_ETB',
          assistante_vie_scolaire: 'AVS_ETB',
          cpe: 'CPE_ETB',
          prof: 'PROF_ETB',
          parents: 'PAR_ETB',
          eleve: 'ELV_ETB',
          default: '' }.freeze
