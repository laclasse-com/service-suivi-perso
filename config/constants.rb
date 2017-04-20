# Liste des constantes de l'application
require 'logger'

LOGGER = Logger.new(STDOUT)

# Gestion des droits
DEFAULT_RIGHTS = { Onglet: [ { profil_id: 'ENS', read: true, write: true },
                             { profil_id: 'EVS', read: true, write: true },
                             { profil_id: 'DOC', read: true, write: true },
                             { profil_id: 'DIR', read: true, write: true } ] }.freeze

CACHE_BUSTER = Time.now.to_i.to_s
