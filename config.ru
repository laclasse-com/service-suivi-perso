# -*- encoding: utf-8 -*-

require 'rubygems'
require 'bundler'

Bundler.require(:default, :development) # require tout les gems définis dans Gemfile
require 'sinatra/reloader' if ENV['RACK_ENV'] == 'development'

puts '----------> configs <----------'
require_relative './config/init'

require 'laclasse/helpers/authentication'
require 'laclasse/cross_app/sender'
require 'laclasse/helpers/app_infos'

puts '----------> libs <-------------'
require_relative './lib/init'

puts '----------> models <-----------'
require_relative './models/init'

puts '----------> objects <-----------'
require_relative './objects/init'

require_relative './app'
require_relative './api'

use Rack::Rewrite do
  rewrite %r{/.*/(app)/(.*)}, '/$1/$2'
end

require 'laclasse/helpers/rack'
Laclasse::Helpers::Rack.configure_rake self

use OmniAuth::Builder do
  configure do |config|
    config.path_prefix = APP_PATH + '/auth'
  end
  provider :cas, CASAUTH::CONFIG
end

map APP_PATH + '/api' do
  run Api
end

run SinatraApp
