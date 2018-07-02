# frozen_string_literal: true

module Suivi
    module Routes
        module Api
            module Notebooks
                def self.registered( app )
                    app.get '/api/notebooks/?' do
                        param :owner, String, required: true

                        halt( 403, '403 Forbidden') unless params[:owner] == user.id

                        json( Notebook.where(owner: params[:owner]).all )
                    end

                    app.get '/api/notebooks/:id?' do
                        param :id, Integer, required: true

                        json( get_notebook( params[:id], user ) )
                    end

                    app.post '/api/notebooks/?' do
                        param :owner, String, required: true
                        param :name, String, required: true
                        param :targets, String, required: true

                        nb = Notebook.create( owner: params[:owner],
                                              name: params[:name],
                                              targets: params[:targets] )

                        nb
                    end

                    app.put '/api/notebooks/:id' do
                        param :id, Integer, required: true
                        param :name, String, required: false
                        param :targets, String, required: false

                        nb = get_notebook( params[:id], user )

                        nb&.update(name: params[:name]) if params.key?( :name )
                        nb&.update(targets: params[:targets]) if params.key?( :targets )

                        nb
                    end

                    app.delete '/api/notebooks/:id' do
                        param :id, Integer, required: true

                        nb = get_notebook( params[:id], user )

                        nb&.destroy
                    end
                end
            end
        end
    end
end
