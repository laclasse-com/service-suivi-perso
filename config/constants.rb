# Liste des constantes de l'application
require 'logger'

URL_REQUEST_TEST = ''.freeze

LOGGER = Logger.new(STDOUT)

# Gestion des droits
DEFAULT_RIGHTS = { Carnet: [ { profil_id: 'ENS', read: true, write: true },
                             { profil_id: 'EVS', read: true, write: true },
                             { profil_id: 'DOC', read: true, write: true },
                             { profil_id: 'DIR', read: true, write: true } ],
                   Onglet: [ { profil_id: 'ENS', read: true, write: true },
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
