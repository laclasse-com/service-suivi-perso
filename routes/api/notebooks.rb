# frozen_string_literal: true

module Suivi
    module Routes
        module Api
            module Notebooks
                def self.registered( app )
                    app.get '/api/notebooks/?' do
                        param :uid, String, required: true

                        json( Notebook.where(owner: params[:uid]).all )
                    end

                    app.get '/api/notebooks/:id?' do
                        param :id, Integer, required: true

                        json( Notebook[id: params[:id] ] )
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

                        nb = Notebook[id: params[:id]]

                        nb&.update(name: params[:name]) if params.key?( :name )
                        nb&.update(targets: params[:targets]) if params.key?( :targets )

                        nb
                    end

                    app.delete '/api/notebooks/:id' do
                        param :id, Integer, required: true

                        nb = Notebook[id: params[:id]]

                        nb&.destroy
                    end
                end
            end
        end
    end
end
