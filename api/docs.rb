#coding: utf-8
# API pour l'interface des docs
class DocsApi < Grape::API
	format :json

	helpers AuthenticationHelpers

  desc "appelle les cmd des docs et retourne la reponse"
  params {
      requires :cmd, type: String
      optional :target, type: String
      optional :init
  }
  get '' do
    begin
      params_docs = {'cmd' => params[:cmd], 'target' => params[:target]}
      params_docs["init"] = params[:init] if params[:init]
      reponse = Laclasse::CrossApp::Sender.send_request_signed(:service_docs_suivi, "cmd/docs", params_docs, {"rack.session" => cookies['rack.session']})
    rescue Exception => e
      LOGGER.error e.message
      LOGGER.error e.backtrace[0..10].to_s
      error!("Une erreur s'est produite", 404)
    end
  end
end