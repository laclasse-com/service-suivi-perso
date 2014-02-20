# -*- encoding: utf-8 -*-

$LOAD_PATH.unshift(File.dirname(__FILE__))
require ::File.expand_path('../app', __FILE__)
require ::File.expand_path('../api/api', __FILE__)
require ::File.expand_path('../controller/suivi_controller', __FILE__)

use Rack::Rewrite do
  rewrite %r{/.*/(css|js|partials|img)/(.*)}, '/$1/$2'
end

use Rack::Session::Cookie,
    key: 'rack.session',
    path: APP_PATH,
    expire_after: 3600, # In seconds
    secret: 'as6df874asd65fg4sd6fg54asd6gf54' # Digest::SHA1.hexdigest( SecureRandom.base64 ) # test only

use OmniAuth::Builder do
    configure do |config|
      config.path_prefix =  APP_PATH + '/auth'
    end
    provider :cas,  CASLaclasseCom::OPTIONS
end


map APP_PATH + "/api" do
  run Api
end

run SinatraApp
