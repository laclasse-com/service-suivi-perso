# coding: utf-8

require 'rubygems'
require 'bundler'

Bundler.require(:default, :development) # require tout les gems définis dans Gemfile
require 'sinatra/reloader' if ENV['RACK_ENV'] == 'development'

require_relative './config/init'

require 'laclasse/cross_app/sender'

require 'laclasse/helpers/authentication'
require 'laclasse/helpers/app_infos'
require 'laclasse/helpers/user'

require_relative './models/carnets'
require_relative './models/droits'
require_relative './models/onglets'
require_relative './models/saisies'
require_relative './models/ressources'

require_relative './lib/helpers/access_and_rights'

require_relative './routes/index'
require_relative './routes/public_url'
require_relative './routes/auth'
require_relative './routes/status'

require_relative './routes/api/carnets'
require_relative './routes/api/onglets'
require_relative './routes/api/onglets_droits'
require_relative './routes/api/saisies'

# Application Sinatra servant de base
class SinatraApp < Sinatra::Base
  configure do
    set :app_file, __FILE__
    set :root, APP_ROOT
    set :public_folder, proc { File.join( root, 'public' ) }
    set :inline_templates, true
    set :protection, true
    set :lock, true
  end

  configure :development do
    register Sinatra::Reloader
    # also_reload '/path/to/some/file'
    # dont_reload '/path/to/other/file'
  end

  helpers Sinatra::Param

  helpers Laclasse::Helpers::User
  helpers Laclasse::Helpers::Authentication
  helpers Laclasse::Helpers::AppInfos

  helpers Suivi::Helpers::AccessAndRights

  # Routes nécessitant une authentification
  [ '/?', '/login' ].each do |route|
    before "#{APP_PATH}#{route}" do
      login!( env['REQUEST_PATH'] ) unless logged?
    end
  end

  register Suivi::Routes::Index
  register Suivi::Routes::PublicUrl
  register Suivi::Routes::Status
  register Suivi::Routes::Auth

  register Suivi::Routes::Api::Carnets
  register Suivi::Routes::Api::Onglets
  register Suivi::Routes::Api::Onglets::Droits
  register Suivi::Routes::Api::Saisies
end
