# -*- encoding: utf-8 -*-

require 'rubygems'
require 'bundler'

Bundler.require(:default, :development) # require tout les gems définis dans Gemfile
require 'sinatra/reloader' if ENV['RACK_ENV'] == 'development'

require_relative './config/init'

require 'laclasse/helpers/rack'

require_relative './app'

Laclasse::Helpers::Rack.configure_rake self

use OmniAuth::Builder do
  configure do |config|
    config.path_prefix = "#{APP_PATH}/auth"
  end
  provider :cas, CASAUTH::CONFIG
end

map "#{APP_PATH}" do
  run SinatraApp
end
