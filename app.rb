# coding: utf-8

require 'rubygems'
require 'bundler'

Bundler.require(:default, ENV['RACK_ENV'].to_sym )

require_relative './config/init'

require_relative './models/carnets'
require_relative './models/droits'
require_relative './models/onglets'
require_relative './models/saisies'
require_relative './models/ressources'

require_relative './lib/helpers/auth'
require_relative './lib/helpers/user'
require_relative './lib/helpers/access_and_rights'

require_relative './routes/index'
require_relative './routes/auth'
require_relative './routes/status'

require_relative './routes/api/carnets'
require_relative './routes/api/onglets'
require_relative './routes/api/droits_onglets'
require_relative './routes/api/saisies'
require_relative './routes/api/sharable'

# Application Sinatra servant de base
class SinatraApp < Sinatra::Base
  helpers Sinatra::Helpers
  helpers Sinatra::Cookies

  helpers LaClasse::Helpers::Auth
  helpers LaClasse::Helpers::User

  helpers Suivi::Helpers::AccessAndRights

  configure do
    set :app_file, __FILE__
    set :root, APP_ROOT
    set :public_folder, ( proc { File.join( root, 'public' ) } )
    set :inline_templates, true
    set :protection, true
    set :lock, true
    set :raise_errors, false
  end

  before do
    request.path.match( %r{#{APP_PATH}/(status|__sinatra__)[/]?.*} ) do
      pass
    end

    login!( request.path ) unless logged?
  end

  register Suivi::Routes::Index
  register Suivi::Routes::Status

  register Suivi::Routes::Api::Carnets
  register Suivi::Routes::Api::Onglets
  register Suivi::Routes::Api::Onglets::Droits
  register Suivi::Routes::Api::Saisies
  register Suivi::Routes::Api::Sharable
end
