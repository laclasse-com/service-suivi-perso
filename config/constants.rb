# Liste des constants de l'application

URL_REQUEST_TEST = ""

STORAGE_DIR = 'storages'

STORAGE_ROOT = File.join(APP_ROOT, STORAGE_DIR)

# répertoire de stockage des vignettes de l'utilisateur, dans sont cartable.
# Ce répertoire est invisible depuis le client.
# Un même répertoire est créé à la racine de l'espace de partage.
THUMBNAILS_DIR = '.tmb'

TEMP_DIRECTORY = File.join(STORAGE_DIR, "tmp")

LANG = "fr"

# Connexion avec l'annuaire ENT
ANNUAIRE = {
	:url => "http://www.dev.laclasse.com/api",
	:service_user => "app/users/",
	:service_users => "app/users/liste/",
	:app_id => "SUIVIELV",
	:secret => "COGJDRZ9ZG4Apkz0GgDWFaLG+yKl/SKIXRHkwkL9OrU="
}




