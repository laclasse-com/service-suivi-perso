  #################################################################################################
  #                             CONFIGURATION POUR EXECUTER LES TESTS                             #
  #################################################################################################
  require 'rubygems'
  require 'rspec'
  require 'rack/test'
  require 'rack/lint'
  require 'rack/mock'
  require 'sequel'
  require 'logger'
  require_relative './bdd.rb'
  include BDD

  require File.expand_path '../../app.rb', __FILE__
  require File.expand_path '../response_annuaire_user.rb', __FILE__
  # Config APP_ROOT s'il n'est pas déjà configuré
  APP_ROOT = File.expand_path(File.join(File.dirname(__FILE__), '..')) unless APP_ROOT
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
