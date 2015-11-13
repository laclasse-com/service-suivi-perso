# coding: utf-8
#################################################################################################
#                             CONFIGURATION POUR EXECUTER LES TESTS                             #
#################################################################################################
require 'rubygems'
require 'bundler'
Bundler.require(:default, :development) # require tout les gems définis dans Gemfile

require 'rspec'
require 'rack/test'
require 'rack/lint'
require 'rack/mock'
require 'sequel'
require 'logger'
require_relative './bdd'
include BDD

require_relative 'response_annuaire_user'

require_relative '../config/init'

require 'laclasse/helpers/authentication'
require 'laclasse/cross_app/sender'
require 'laclasse/helpers/app_infos'

puts '----------> libs <-------------'
require_relative '../lib/init'

puts '----------> models <-----------'
require_relative '../models/init'

puts '----------> objects <-----------'
require_relative '../objects/init'

# Config APP_ROOT s'il n'est pas déjà configuré
APP_ROOT = File.expand_path(File.join(File.dirname(__FILE__), '..')) unless APP_ROOT

require_relative '../app'

@logger = Logger.new(STDOUT)
# paramètre pour les Api
module RSpecMixin
  include Rack::Test::Methods
  def app
    Api
  end
end

BDD.clear_db
BDD.load_in_tables

# Requires supporting ruby files with custom matchers and macros, etc,
# from spec/support/ and its subdirectories.
# Dir[File.expand_path('spec/support/**/*.rb')].each { |f| require f }

# configuration pour mocker la session
RSpec.configure do |config|
  config.around(:each) do |test|
    Sequel.transaction([DB], rollback: :always) { test.run }
  end
  config.include RSpecMixin
  config.mock_with :rspec
  config.expect_with :rspec

  # Use color in STDOUT
  config.color = true

  # Use color not only in STDOUT but also in pagers and files
  config.tty = true

  # Use the specified formatter
  config.formatter = :documentation # :progress, :html, :textmate
end
