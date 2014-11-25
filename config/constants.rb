# Liste des constants de l'application

URL_REQUEST_TEST = ""

# STORAGE_DIR = 'storages'

# STORAGE_ROOT = File.join(APP_ROOT, STORAGE_DIR)

# répertoire de stockage des vignettes de l'utilisateur, dans sont cartable.
# Ce répertoire est invisible depuis le client.
# Un même répertoire est créé à la racine de l'espace de partage.
# THUMBNAILS_DIR = '.tmb'

# TEMP_DIRECTORY = File.join(STORAGE_DIR, "tmp")

LANG = "fr"

# Connexion avec l'annuaire ENT
# ANNUAIRE = {
# 	:url => "http://www.dev.laclasse.com/api",
# 	:service_user => "app/users/",
# 	:service_users => "app/users/liste/",
# 	:service_regroupement => "app/regroupements/",
# 	:app_id => "SUIVIELV",
# 	:secret => "2b9r1HHkatMfvW3MljCtNZOWvBBbODigewZrPw5P6U8="
# }

#les couleurs du panel de l'interface
COLOR = {
	:rouge => "#EB5454",
	:bleu => "#1AA1CC",
	:violet => "#9C75AB",
	:jaune => "#E8C254",
	:vert => "#80BA66"
}

ANNUAIRE_URL = {
	:suivi_perso_search => "eleves/search/",
	:user_liste => "liste/"
}

#Couleurs des carnets sur 16 cases
PANEL_COLOR = [COLOR[:bleu],COLOR[:jaune],COLOR[:violet],COLOR[:vert],
			   COLOR[:rouge],COLOR[:vert],COLOR[:bleu],COLOR[:jaune],
			   COLOR[:violet],COLOR[:bleu],COLOR[:jaune],COLOR[:rouge],
			   COLOR[:jaune],COLOR[:rouge],COLOR[:vert],COLOR[:bleu]
			  ]

AVATAR = {
  :F => "/app/bower_components/charte-graphique-laclasse-com/images/avatar_feminin.svg",
  :M => "/app/bower_components/charte-graphique-laclasse-com/images/avatar_masculin.svg"
}
UAI_EVIGNAL = "0692165D"
MAIL_DOMAINE = "@laclasse.com"

