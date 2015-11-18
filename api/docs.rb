# coding: utf-8
# API pour l'interface des docs
class DocsApi < Grape::API
  format :json

  helpers URLHelpers

  desc 'appelle les cmd des docs et retourne la reponse'
  params do
    requires :cmd, type: String
    optional :target, type: String
    optional :init
  end
  get do
    params_docs = {'cmd' => params[:cmd], 'target' => params[:target]}
    params_docs['init'] = params[:init] if params[:init]
    Laclasse::CrossApp::Sender.send_request_signed(:service_docs_suivi, 'cmd/docs', params_docs, 'rack.session' => cookies['rack.session'])
  end
end
