require 'sinatra'
require "sinatra/reloader" if ENV[ 'RACK_ENV' ] == 'development'

# Application Sinatra servant de base
class SinatraApp < Sinatra::Base

  configure do
  set :app_file, __FILE__
  set :root, APP_ROOT
  set :public_folder, Proc.new { File.join(root, "public") }
  set :inline_templates, true
  set :protection, true
  set :lock, true
  end

  configure :development do
    register Sinatra::Reloader
    #also_reload '/path/to/some/file'
    #dont_reload '/path/to/other/file'
  end

  helpers AuthenticationHelpers
  include CarnetsLib

  # Routes nécessitant une authentification
  ['/?', '/login' ].each { |route| 
    before APP_PATH + route do 
      login! env['REQUEST_PATH'] unless is_logged?
    end
  }

  get APP_PATH + '/' do
    if is_logged?
      erb :app
    else
      erb "<div class='jumbotron'>
            <h1>Public page</h1>
            <p class='lead'>This starter app is an example of Omniauth-cas and sinatra integration based on rack system.<br />
            Please try to connect with CAS sso...
            </p>
            </div>"
    end  
  end

  get APP_PATH + '/public/:url' do
    begin
      carnet = Carnet.new(nil, nil, nil, nil, nil, params[:url])
      carnet.read
      tabs = get_tabs carnet.uid_elv, nil, params[:url]
      puts tabs.inspect
      response = Laclasse::CrossAppSender.send_request_signed(:service_annuaire_user, carnet.uid_elv, {"expand" => "true"})
      erb"<div class='row-fluid' style='height: 100%'>"+
          "<div class='col-xs-6 col-sm-6 col-md-4 col-lg-4 aside-contener' style='height:100%'>"+
              "<div style='height:100%'>"+(HtmlMessageGenerator.aside_public_carnet response)+"</div>"+
          "</div>"+
          "<div class='col-xs-6 col-sm-6 col-md-8 col-lg-8 main-contener' style='height:100%; overflow:auto'>"+
              "<div style='height:100%'>"+(HtmlMessageGenerator.main_public_carnet tabs)+"</div>"+
          "</div>"+
        "</div>"
    rescue Exception => e
      erb :erreur
    end
  end

  get APP_PATH + '/auth/:provider/callback' do
    init_session( request.env )
    redirect params[:url] if params[:url] !=  env['rack.url_scheme'] + "://" + env['HTTP_HOST'] + APP_PATH + '/'
    redirect APP_PATH + '/'
    #erb "<h1>Connected !</h1><pre>#{request.env['omniauth.auth'].to_html}</pre><hr>"
  end

  get APP_PATH + '/auth/failure' do
    erb "<h1>Authentication Failed:</h1><h3>message:<h3> <pre>#{params}</pre>"
  end

  get APP_PATH + '/auth/:provider/deauthorized' do
    erb "#{params[:provider]} has deauthorized this app."
  end

  get APP_PATH + '/protected' do
    throw(:halt, [401, "Not authorized\n"]) unless session[:authenticated]
    erb "<pre>#{request.env['omniauth.auth'].to_json}</pre><hr>
       <a href='<%= APP_PATH %>/logout'>Logout</a>"
  end

  get APP_PATH + '/login' do
    login! APP_PATH + '/'
  end

  get APP_PATH + '/logout' do
    logout! (env['rack.url_scheme'] + "://" + env['HTTP_HOST'] + APP_PATH + '/')
  end
end