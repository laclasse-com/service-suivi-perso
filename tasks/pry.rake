# coding: utf-8

ENV['RACK_ENV'] = 'development'

task :load_config do
  require 'rubygems'
  require 'bundler'

  Bundler.require(:default, :development) # require tout les gems définis dans Gemfile
  require 'sinatra/reloader' if ENV['RACK_ENV'] == 'development'

  require_relative '../config/init'

  require 'laclasse/cross_app/sender'

  require 'laclasse/helpers/authentication'
  require 'laclasse/helpers/app_infos'
  require 'laclasse/helpers/rack'
  require 'laclasse/helpers/user'

  require_relative '../lib/init'
  require_relative '../models/init'
  require_relative '../objects/init'

  require_relative '../app'
end

desc 'Open pry with app environment'
task pry: :load_config do
  LOGGER = Laclasse::LoggerFactory.get_logger
  pry.binding
end
