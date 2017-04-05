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
DEFAULT_RIGHTS = { Carnet: [ { profil_id: 'ELV', read: false, write: false },
                             { profil_id: 'TUT', read: false, write: false },
                             { profil_id: 'ENS', read: true, write: true },
                             { profil_id: 'EVS', read: true, write: true },
                             { profil_id: 'DOC', read: true, write: true },
                             { profil_id: 'DIR', read: true, write: true } ],
                   Onglet: [ { profil_id: 'ELV', read: false, write: false },
                             { profil_id: 'TUT', read: false, write: false },
                             { profil_id: 'ENS', read: true, write: true },
                             { profil_id: 'EVS', read: true, write: true },
                             { profil_id: 'DOC', read: true, write: true },
                             { profil_id: 'DIR', read: true, write: true } ],
                   Saisie: [ { profil_id: 'ELV', read: true, write: false },
                             { profil_id: 'TUT', read: true, write: false },
                             { profil_id: 'ENS', read: true, write: false },
                             { profil_id: 'EVS', read: true, write: false },
                             { profil_id: 'DOC', read: true, write: false },
                             { profil_id: 'DIR', read: true, write: false } ] }.freeze

CACHE_BUSTER = Time.now.to_i.to_s
