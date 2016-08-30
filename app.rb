# coding: utf-8

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

  helpers URLHelpers
  helpers Laclasse::Helpers::Authentication
  helpers Laclasse::Helpers::AppInfos
  include CarnetsLib

  # Routes nécessitant une authentification
  [ '/?', '/login' ].each do |route|
    before "#{APP_PATH}#{route}" do
      login! env['REQUEST_PATH'] unless logged?
    end
  end

  get "#{APP_PATH}/" do
    erb :app if logged?
  end

  get "#{APP_PATH}/status" do
    content_type :json
    app_status = app_infos

    app_status[:status] = 'OK'
    app_status[:reason] = 'L\'application fonctionne.'

    app_status.to_json
  end

  get "#{APP_PATH}/public/:url" do
    begin
      carnet = Carnet.new( nil, nil, nil, nil, nil, params[:url] )
      carnet.read
      tabs = tab_list( carnet.uid_elv, nil, params[:url] )

      response = Laclasse::CrossApp::Sender.send_request_signed( :service_annuaire_user, carnet.uid_elv, 'expand' => 'true' )

      @aside_public_carnet = HtmlMessageGenerator.aside_public_carnet( response )
      @main_public_carnet = HtmlMessageGenerator.main_public_carnet( tabs )

      erb :carnet_public
    rescue Exception => e
      puts e.message
      status 404
      erb :erreur
    end
  end

  get "#{APP_PATH}/auth/:provider/callback" do
    init_session( request.env )

    protocol = CASAUTH::CONFIG[:ssl] ? 'https' : 'http'
    redirect params[:url] if params[:url] != "#{protocol}://#{env['HTTP_HOST']}#{APP_PATH}"
    redirect "#{APP_PATH}/"
  end

  get "#{APP_PATH}/auth/failure" do
    erb "<h1>L'authentification a échoué : </h1><h3>message:<h3> <pre>#{params}</pre>"
  end

  get "#{APP_PATH}/login" do
    login! "#{APP_PATH}/"
  end

  get "#{APP_PATH}/logout" do
    protocol = CASAUTH::CONFIG[:ssl] ? 'https' : 'http'
    logout! "#{protocol}://#{env['HTTP_HOST']}#{APP_PATH}"
  end
end
