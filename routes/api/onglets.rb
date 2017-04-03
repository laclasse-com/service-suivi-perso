# -*- coding: utf-8 -*-

module Suivi
  module Routes
    module Api
      module Onglets
        def self.registered( app )
          app.get "#{APP_PATH}/api/carnets/:uid_eleve/onglets" do
            param :uid_eleve, String, required: true

            get_and_check_carnet( params[:uid_eleve], :read )
              .onglets
              .naked
              .all
          end

          app.post "#{APP_PATH}/api/carnets/:uid_eleve/onglets" do
            param :uid_eleve, String, required: true
            param :nom, String, required: true
            param :ordre, Integer, required: true

            onglet = get_and_check_carnet( params[:uid_eleve], :write )
                       .onglets_dataset[nom: params[:nom]]
            if onglet.nil?
              onglet = Onglet.create( carnet_id: carnet.id,
                                      nom: params[:nom],
                                      ordre: params[:ordre],
                                      sharable_id: nil,
                                      date_creation: DateTime.now )

              onglet.init_droits( DEFAULT_RIGHTS[:Onglet], user[:uid] )
            end

            onglet
          end

          app.put "#{APP_PATH}/api/carnets/:uid_eleve/onglets/:onglet_id" do
            param :uid_eleve, String, required: true
            param :onglet_id, Integer, required: true
            param :nom, String, required: false
            param :ordre, Integer, required: false
            param :sharable_id, String, required: false

            get_and_check_carnet( params[:uid_eleve], :write )

            onglet = get_and_check_onglet( params[:onglet_id], :write )
            onglet.nom = params[:nom] if params.key?( :nom )
            onglet.ordre = params[:ordre] if params.key?( :ordre )
            onglet.sharable_id = params[:sharable_id] if params.key?( :sharable_id )
            onglet.save

            onglet
          end

          app.delete "#{APP_PATH}/api/carnets/:uid_eleve/onglets/:onglet_id" do
            param :uid_eleve, String, required: true
            param :onglet_id, Integer, required: true

            carnet = get_and_check_carnet( params[:uid_eleve], :write )

            onglet = get_and_check_onglet( params[:onglet_id], :write )

            onglet.remove_all_droits

            carnet.remove_onglet( onglet )
          end
        end
      end
    end
  end
end
