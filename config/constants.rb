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
URI_API = "http://www.dev.laclasse.com/api"

SERVICE_ANNUAIRE_USER = "app/users/"

SERVICE_ANNUAIRE_LISTE_USER = "app/users/liste/"

APP_ID_DOC = "DOC"

APIKEY = "A50vIgYTfFnxC1wSN22LpOBIqT7brCJB"

SECRET_KEY = "geQsB9QTsVLACVjdjTGMIWavrK/4KKpzUoNzSmZ8+QY="

FAKE_KEY = "t7OhZ873mgDP3q5gZPIVhgfhdrWrqRkgdLnTIv7m0QVAo="

#false key for test
# SECRET_KEY = "hW8hvfYddVd+Ykmj8xZkJFpuWgq9/ivRmtl+ghfhjdsghSSZujgg2oSgUqxFc1R7dGEpmkIr4LMljF1A=="

MESSAGE_ETHERPAD = "Vous etes a present sur etherpad. \n Celui-ci est un document collaboratif. \n "

URL_ETHERPAD = 'http://192.168.0.219:9001'

ERROR_MESSAGE = "Une erreur s'est produite, \n veuillez actualiser votre page ou contacter le service la classe.com"

MODIFQUIZ = "http://www.dev.laclasse.com/pls/education/!page.laclasse?contexte=DOCUMENTS&paction=modifier_element&ptype="

OPENQUIZ = "http://www.dev.laclasse.com/pls/education/quizz.lance_exercice?p_exo_id="
