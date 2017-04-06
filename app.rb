# coding: utf-8

require 'rubygems'
require 'bundler'

Bundler.require(:default, ENV['RACK_ENV'].to_sym )

require_relative './config/init'

require 'laclasse/cross_app/sender'

require 'laclasse/helpers/authentication'
require 'laclasse/helpers/app_infos'
require 'laclasse/helpers/user'

require_relative './models/carnets'
require_relative './models/droits'
require_relative './models/onglets'
require_relative './models/saisies'

require_relative './lib/helpers/access_and_rights'

require_relative './routes/index'
require_relative './routes/public_url'
require_relative './routes/auth'
require_relative './routes/status'

require_relative './routes/api/carnets'
require_relative './routes/api/onglets'
require_relative './routes/api/droits_onglets'
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
    set :raise_errors, false
  end

  helpers Sinatra::Param

  helpers Laclasse::Helpers::User
  helpers Laclasse::Helpers::Authentication
  helpers Laclasse::Helpers::AppInfos

  helpers Suivi::Helpers::AccessAndRights

  before  do
    request.path.match( %r{#{APP_PATH}/(auth|login|status|__sinatra__)[/]?.*} ) do
      pass
    end

    login!( request.path ) unless logged?
  end

  register Suivi::Routes::Auth

  register Suivi::Routes::Index
  register Suivi::Routes::PublicUrl
  register Suivi::Routes::Status

  register Suivi::Routes::Api::Carnets
  register Suivi::Routes::Api::Onglets
  register Suivi::Routes::Api::Onglets::Droits
  register Suivi::Routes::Api::Saisies
end
