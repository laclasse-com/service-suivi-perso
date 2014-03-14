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
	:service_regroupement => "app/regroupements/",
	:app_id => "SUIVIELV",
	:secret => "COGJDRZ9ZG4Apkz0GgDWFaLG+yKl/SKIXRHkwkL9OrU="
}

#les couleurs du panel de l'interface
COLOR = {
	:rouge => "#EB5454",
	:bleu => "#1AA1CC",
	:violet => "#9C75AB",
	:jaune => "#E8C254",
	:vert => "#80BA66"
}

#Couleurs des carnets sur 16 cases
# PANEL_COLOR = [COLOR[:jaune],COLOR[:rouge],COLOR[:bleu],COLOR[:violet],
# 			   COLOR[:bleu],COLOR[:violet],COLOR[:vert],COLOR[:jaune],
# 			   COLOR[:vert],COLOR[:jaune],COLOR[:rouge],COLOR[:bleu],
# 			   COLOR[:rouge],COLOR[:bleu],COLOR[:violet],COLOR[:vert]
# 			  ]
PANEL_COLOR = [COLOR[:bleu],COLOR[:jaune],COLOR[:violet],COLOR[:vert],
			   COLOR[:rouge],COLOR[:vert],COLOR[:bleu],COLOR[:jaune],
			   COLOR[:violet],COLOR[:bleu],COLOR[:jaune],COLOR[:rouge],
			   COLOR[:jaune],COLOR[:rouge],COLOR[:vert],COLOR[:bleu]
			  ]

SVG_AVATAR_F = "M118.05,127.561c0.044-0.232-1.54-12.343-1.555-12.588c0,0-2.954-7.807-7.623-8.603c-4.665-0.801-10.663-2.497-13.171-4.469c-1.467-1.163-6.242-3.175-8.454-4.013c-1.034-0.391-2.801-3.571-3.408-5.008 c-0.613-1.438-4.822-4.344-5.897-4.504l-0.167-5.983l12.188-3.95c0,0,3.14-1.518,3.443-1.518c0.31,0-1.452-2.407-1.685-3.055 c-0.228-0.64-1.377-5.005-1.377-5.005s4.115,5.243,6.2,6.224c0,0-4.1-8.017-5.317-12.483c-1.225-4.471-2.032-11.451-2.032-12.088 c0-0.642-2.524-19.39-3.901-22.499c-1.38-3.117-3.25-7.342-6.449-9.416c-3.202-2.075-7.947-5.029-14.762-5.424 c-0.103-0.004-0.204-0.004-0.306-0.015c-0.102,0.008-0.204,0.008-0.308,0.015c-6.81,0.396-11.556,3.351-14.755,5.424 c-3.198,2.072-5.068,6.3-6.449,9.416c-1.377,3.109-3.905,21.857-3.905,22.499c0,0.637-0.714,7.9-1.938,12.364 c-1.226,4.472-5.409,12.205-5.409,12.205c2.086-0.979,6.199-6.223,6.199-6.223s-1.481,4.79-1.714,5.432 c-0.233,0.644-1.653,2.629-1.347,2.629c0.305,0,3.447,1.518,3.447,1.518l12.19,3.95l-0.171,5.983 c-1.07,0.16-5.281,3.067-5.896,4.504c-0.615,1.437-2.377,4.617-3.408,5.008c-2.218,0.837-6.988,2.85-8.456,4.013 c-2.515,1.973-8.496,3.668-13.169,4.469c-4.669,0.794-7.619,8.057-7.619,8.057c-0.018,0.248-1.6,12.9-1.561,13.134H118.05z"

SVG_AVATAR_M = "M2.155,127.559V116.52c0,0,0.725-6.775,8.942-8.879c0,0,13.236-4.799,23.603-9.278c5.361-2.315,6.515-3.706,11.923-6.079 c0,0,0.564-2.756,0.361-4.396h4.229c0,0,0.966,0.56,0-5.921c0,0-5.155-1.356-5.396-11.677c0,0-3.872,1.296-4.107-4.958 c-0.162-4.239-3.465-7.918,1.29-10.957l-2.418-6.479c0,0-4.833-26.154,9.062-22.315c-5.86-6.958,33.229-13.916,35.769,8.158 c0,0,1.809,11.918,0,20.075c0,0,5.707-0.656,1.892,10.24c0,0-2.094,7.837-5.316,6.078c0,0,0.525,9.917-4.549,11.599 c0,0,0.36,5.276,0.36,5.638l4.834,0.719c0,0-0.727,4.321,0.121,4.802c0,0,5.731,3.896,12.564,5.64 c13.172,3.354,28.76,9.116,28.76,14.154c0,0,1.329,6.719,1.329,14.878H2.155V127.559z"

