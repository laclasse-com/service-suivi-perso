#################################################################################################
#                             CONFIGURATION POUR EXECUTER LES TESTS                             #
#################################################################################################
  require 'rubygems'
  require 'rspec'
  require 'rack/test'
  require 'simplecov'
  require 'rack/lint'
  require 'rack/mock'
  # require 'coveralls'
  # require 'sequel'
  # require 'debugger'
  # require 'tsort'

  # Coveralls.wear!
  ##############################################
  # Définition de la couverture de simpleCov,
  # et Coveralls
  #
  ##############################################
  SimpleCov.profiles.define 'suivi' do
   add_filter '/config/'
   add_filter '/spec/'
   add_filter '/tasks/'
   add_filter '/helpers/'
   add_filter '/model/'
   add_filter '/controller/'

   # add_group 'Controller', '/controller'
   add_group 'Api', '/api'
   # add_group 'Helpers', '/helpers'
   add_group 'Libraries', '/lib'
   # add_group 'Sequel models', '/model'
  end
  SimpleCov.formatter = SimpleCov::Formatter::MultiFormatter[
   SimpleCov::Formatter::HTMLFormatter,
   # Coveralls::SimpleCov::Formatter
  ]

  SimpleCov.start 'suivi'

  ##############################################
  #précise l'environnement
  ENV["RACK_ENV"] ||= 'test'

  require File.expand_path '../../app.rb', __FILE__
  require File.expand_path '../response_annuaire_user.rb', __FILE__
  #Config APP_ROOT s'il n'est pas déjà configuré
  APP_ROOT = File.expand_path(File.join(File.dirname(__FILE__), '..')) if !APP_ROOT

  #paramètre pour les Api
  module RSpecMixin
    include Rack::Test::Methods
    def app() Api end
  end

  # Requires supporting ruby files with custom matchers and macros, etc,
  # from spec/support/ and its subdirectories.
  # Dir[File.expand_path('spec/support/**/*.rb')].each { |f| require f }

  #configuration pour mocker la session
  RSpec.configure do |config|
    config.include RSpecMixin
    config.mock_with :rspec
    config.expect_with :rspec

    # Use color in STDOUT
    config.color_enabled = true

    # Use color not only in STDOUT but also in pagers and files
    config.tty = true

    # Use the specified formatter
    config.formatter = :documentation # :progress, :html, :textmate
  end
###################################################################################################
###################################################################################################


#############
# CONSTANTE #
#############

#false key for test
FAKE_KEY_TEST = "fakekeytest"

# Connexion avec l'annuaire ENT
ANNUAIRE = {
  :url => "",
  :service_test => "annuaire/test/",
  :service_user => "annuaire/user/",
  :service_users => "annuaire/users/",
  :app_id => "test",
  :secret => "keytest"
}

####################
# DONNEES GLOBALES #
####################

#id de l'utilisateur de test
def user_uid 
  "VAA99999"
end

#liste des uid des eleves auquel est responsable notre utilisateur de test.
def uid_eleve_of_user
  ["VAA99901", "VAA99902", "VAA99903", "VAA99904", "VAA99905", "VAA99906", "VAA99907", "VAA99908", "VAA99909", "VAA99910"]
end

#url de test signé
def url_test_signed
  Annuaire.sign(ANNUAIRE[:url], ANNUAIRE[:service_test], {"expand" => "true"}, ANNUAIRE[:secret], ANNUAIRE[:app_id])
end

def current_user
  @current_user = {:user => "hquenin",:info => Info.new(user_uid)}
end

###############################################
# REDEFINITION POUR MOCKER L'AUTHENTIFICATION #
###############################################

#réécriture du helpers pour enlever l'authentification en phase de test
module AuthenticationHelpers
  module_function

  def is_logged?
    true
  end

  def get_current_user
  	@current_user = {:user => "hquenin",:info => Info.new(user_uid)}
  end
end

#class permettant de reproduire une la partie current_user de la session utilisateur.
class Info
  attr_accessor :user, :uid

  def initialize(uid)
    @user = "hquenin"
    @idEnt = "Laclasse"
    @ENT_id = "999"
    @uid = uid
    @LaclasseNom = "QUENIN"
    @LaclassePrenom = "homer"
    @LaclasseDateNais = "1974-04-08"
    @LaclasseSexe = "F"
    @LaclasseCivilite = "Mme"
    @ENTPersonStructRattachRNE = "0690078K"
    @ENTStructureNomCourant = "CLG-VAL D'ARGENT"
    @ENTPersonProfils = "ENS:0690078K"
    @ENTPersonRoles = "PROF_ETB:0690078K:9999:Professeur:CLG-VAL D'ARGENT"
    @LaclasseEmail = "Homer.Quenin@ac-lyon.fr"
    @LaclasseEmailAca = "Homer.Quenin@ac-lyon.fr"
  end
end

######################################################################
# REDEFINITION DU MODULE ANNUAIRE POUR MOCKER LA REPONSE DE CELUI CI #
######################################################################

#on surcharge la méthode send_request_signed pour tester les autres fonction.
module Annuaire
  module_function
  def send_request_signed(url, service, args)
    response = ""
    #selon le service on renverra la reponse adéquat.
    if service == ANNUAIRE[:service_user] + user_uid
      args = {"expand" => false} if args.empty?
      response = response_service_user(args["expand"])
    end

    if service == ANNUAIRE[:service_users] + uid_eleve_of_user.join(";")
      response = response_service_users
    end
    response
  end
end

##########################
# REPONSES DE L'ANNUAIRE #
##########################

def response_service_user (expand)
  #TODO: METTRE LA REPONSE QUAND BASHAR L'AURA CREE
  response = ""
  if expand == "true"
    response = USER
  end
  response
end

def response_service_users ()
  response = [
    {"id_ent" => "VAA99001","nom" => "NOM1","prenom" =>"Prenom1","full_name" => "Nom1 Prenom1", "etablissement_nom" =>"CLG-VAL D'ARGENT", "classe_libelle" =>"3C"},
    {"id_ent" => "VAA99002","nom" => "NOM2","prenom" => "Prenom2","full_name" => "Nom2 Prenom2", "etablissement_nom" =>"CLG-VAL D'ARGENT", "classe_libelle" =>"3C"},
    {"id_ent" => "VAA99003","nom" => "NOM3","prenom" => "Prenom3","full_name" => "Nom3 Prenom3", "etablissement_nom" =>"CLG-VAL D'ARGENT", "classe_libelle" =>"6B"},
    {"id_ent" => "VAA99004","nom" => "NOM4","prenom" => "Prenom4","full_name" => "Nom4 Prenom4", "etablissement_nom" =>"CLG-VAL D'ARGENT", "classe_libelle" =>"6B"},
    {"id_ent" => "VAA99005","nom" => "NOM5","prenom" => "Prenom5","full_name" => "Nom5 Prenom5", "etablissement_nom" =>"CLG-VAL D'ARGENT", "classe_libelle" =>"5D"},
    {"id_ent" => "VAA99006","nom" => "NOM6","prenom" => "Prenom6","full_name" => "Nom6 Prenom6", "etablissement_nom" =>"CLG-VAL D'ARGENT", "classe_libelle" =>"5D"},
    {"id_ent" => "VAA99007","nom" => "NOM7","prenom" => "Prenom7","full_name" => "Nom7 Prenom7", "etablissement_nom" =>"CLG-VAL D'ARGENT", "classe_libelle" =>"4E"},
    {"id_ent" => "VAA99008","nom" => "NOM8","prenom" => "Prenom8","full_name" => "Nom8 Prenom8", "etablissement_nom" =>"CLG-VAL D'ARGENT", "classe_libelle" =>"4E"},
    {"id_ent" => "VAA99009","nom" => "NOM9","prenom" => "Prenom9","full_name" => "Nom9 Prenom9", "etablissement_nom" =>"CLG-TOTO", "classe_libelle" =>"4E"},
    {"id_ent" => "VAA99010","nom" => "NOM10","prenom" => "Prenom10","full_name" => "Nom10 Prenom10", "etablissement_nom" =>"CLG-TOTO", "classe_libelle" =>"4E"}
  ]
end

################################################
# DONNEES DE TEST POUR LA LIBRAIRIE HASH_DEBUG #
################################################

def hash_de_test 
  {a: 'A', b: { c: 'C', d: { e: 'E', f: 'F'}, g: 'G'}, h: 'H' }
end

def reponse_hash_debug 
  "<ul><li><strong>a</strong> : <span>A</span></li><li><strong>b</strong> : <ul><li><strong>c</strong> : <span>C</span></li><li><strong>d</strong> : <ul><li><strong>e</strong> : <span>E</span></li><li><strong>f</strong> : <span>F</span></li></ul><li><strong>g</strong> : <span>G</span></li></ul><li><strong>h</strong> : <span>H</span></li></ul>"
end

##################################
# CREATION D'UNE BASE DE DONNEES #
##################################

class BDD

  # def initialize
  # end

  def clear_db
    Rights.all.each do |right|
      right.delete
    end
    Entrees.all.each do |entree|
      entree.delete
    end

    Carnets.all.each do |carnet|
      carnet.delete
    end
  end

  def load_in_tables_of(data)
    #chargements des données dans la tables carnets
    carnets = []
    i = 0
    data[:carnets].each do |carnet|
      if !carnet.empty? && !carnet.nil?
        carnets.push(create_carnet(carnet).id)
      end
    end

    data[:rights].each do |right|
      if !right.empty? && !right.nil?
        right[:carnets_id] = carnets[i]
        create_right(right)
        i+=1
      end
    end

    data[:entrees].each do |entree|
      if !entree.empty? && !entree.nil?
        entree[:carnets_id] = carnets[i]
        create_entree(entree)
        i+=1
      end
    end
  end


  def create_carnet(opt = {})
    carnet = Carnets.new
    carnet.uid = opt[:uid]
    carnet.nom = opt[:nom]
    carnet.prenom = opt[:prenom]
    carnet.etablissement = opt[:etablissement]
    carnet.classe = opt[:classe]

    carnet.save
    Carnets[:uid => opt[:uid]]
  end

  def create_right(opt = {})
    right = Rights.new
    right.uid = opt[:uid]
    right.read = opt[:read]
    right.write = opt[:write]
    right.carnets_id = opt[:carnets_id]

    right.save
    right
  end

  def create_entree(opt = {})
    entree = Entrees.new
    entree.uid = opt[:uid]
    entree.code_matiere = opt[:code_matiere]
    entree.date = opt[:date]
    entree.data = opt[:data]
    entree.carnets_id = opt[:carnets_id]

    entree.save
    entree
  end
end

#######################
# DONNEES POUR LA BDD #
#######################

def init_data
  {
    :carnets => [
      {
        :uid => "VAA99001",
        :nom => "Nom1",
        :prenom => "Prenom1",
        :etablissement => "CGL_TEST1",
        :classe => "6A"
      },
      {
        :uid => "VAA99002",
        :nom => "Nom2",
        :prenom => "Prenom2",
        :etablissement => "CGL_TEST1",
        :classe => "6A"
      },
      {
        :uid => "VAA99003",
        :nom => "Nom3",
        :prenom => "Prenom3",
        :etablissement => "CGL_TEST1",
        :classe => "6A"
      },
      {
        :uid => "VAA99004",
        :nom => "Nom4",
        :prenom => "Prenom4",
        :etablissement => "CGL_TEST1",
        :classe => "4C"
      },
      {
        :uid => "VAA99005",
        :nom => "Nom5",
        :prenom => "Prenom5",
        :etablissement => "CGL_TEST2",
        :classe => "6B"
      }
    ],
    :rights => [
      {
        :uid => user_uid,
        :read => 1,
        :write => 1,
        :carnets_id => nil
      },
      {
        :uid => user_uid,
        :read => 1,
        :write => 1,
        :carnets_id => nil
      },
      {
        :uid => user_uid,
        :read => 0,
        :write => 0,
        :carnets_id => nil
      },
      {
        :uid => user_uid,
        :read => 1,
        :write => 1,
        :carnets_id => nil
      },
      {
        :uid => user_uid,
        :read => 1,
        :write => 1,
        :carnets_id => nil
      },
    ],
    :entrees => [
      # {
      #   :uid =>
      #   :code_matiere =>
      #   :date => 
      #   :data =>
      #   :carnets_id =>
      # }
    ]
  }
end


#########################
# LES CARNETS DE LA BDD #
#########################

def carnets1
  Carnets[:uid => "VAA99001"]
end

def carnets2
  Carnets[:uid => "VAA99002"]
end

def carnets3
  Carnets[:uid => "VAA99003"]
end

def carnets4
  Carnets[:uid => "VAA99004"]
end

def carnets5
  Carnets[:uid => "VAA99005"]
end
