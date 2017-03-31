# -*- coding: utf-8 -*-

module Suivi
  module Routes
    module Api
      module Onglets
        def self.registered( app )
          app.get "#{APP_PATH}/api/carnets/:uid_eleve/onglets" do
            param :uid_eleve, String, required: true

            carnet = Carnet.of( params[:uid_elv] )
            error!( '404 Unknown carnet', 404 ) if carnet.nil?
            error!( '403 Forbidden', 403 ) unless carnet.allow?( user, :read )

            carnet.onglets.naked.all
          end

          app.post "#{APP_PATH}/api/carnets/:uid_eleve/onglets" do
            param :uid_eleve, String, required: true
            param :nom, String, required: true
            param :ordre, Integer, required: true

            carnet = Carnet.of( params[:uid_eleve] )
            error!( '404 Unknown carnet', 404 ) if carnet.nil?
            error!( '403 Forbidden', 403 ) unless carnet.allow?( user, :write )

            onglet = carnet.onglets_dataset[nom: params[:nom]]
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

            carnet = Carnet.of( params[:uid_eleve] )
            error!( '404 Unknown carnet', 404 ) if carnet.nil?

            onglet = carnet.onglets_dataset[id: params[:onglet_id]]
            error!( '404 Unknown onglet', 404 ) if onglet.nil?
            error!( '403 Forbidden', 403 ) unless onglet.allow?( user, :write )

            onglet.nom = params[:nom] if params.key?( :nom )
            onglet.ordre = params[:ordre] if params.key?( :ordre )
            onglet.sharable_id = params[:sharable_id] if params.key?( :sharable_id )
            onglet.save

            onglet
          end

          app.delete "#{APP_PATH}/api/carnets/:uid_eleve/onglets/:onglet_id" do
            param :uid_eleve, String, required: true
            param :onglet_id, Integer, required: true

            carnet = Carnet.of( params[:uid_eleve] )
            error!( '404 Unknown carnet', 404 ) if carnet.nil?

            onglet = carnet.onglets_dataset.where[id: params[:onglet_id]]
            error!( '404 Unknown onglet', 404 ) if onglet.nil?
            error!( '403 Forbidden', 403 ) unless onglet.allow?( user, :write )

            onglet.remove_all_droits

            carnet.remove_onglet( onglet )
          end

          # droits
          app.get "#{APP_PATH}/api/carnets/:uid_eleve/onglets/:onglet_id/droits" do
            param :uid_eleve, String, required: true
            param :onglet_id, Integer, required: true

            carnet = Carnet.of( params[:uid_eleve] )
            error!( '404 Unknown carnet', 404 ) if carnet.nil?

            onglet = carnet.onglets_dataset.where[id: params[:onglet_id]]
            error!( '404 Unknown onglet', 404 ) if onglet.nil?
            error!( '403 Forbidden', 403 ) unless onglet.allow?( user, :write )

            onglet.droits_dataset.naked.all
          end

          app.post "#{APP_PATH}/api/carnets/:uid_eleve/onglets/:onglet_id/droits" do
            param :uid_eleve, String, required: true
            param :onglet_id, Integer, required: true
            param :uid, String, required: false
            param :profil_id, String, required: false
            param :read, Boolean, required: false
            param :write, Boolean, required: false

            error!( '400 missing parameter', 400 ) unless ( params.key?(:uid) || params.key?(:profil_id) ) && ( params.key?(:read) || params.key?(:write) )

            carnet = Carnet.of( params[:uid_eleve] )
            error!( '404 Unknown carnet', 404 ) if carnet.nil?

            onglet = carnet.onglets_dataset.where[id: params[:onglet_id]]
            error!( '404 Unknown onglet', 404 ) if onglet.nil?
            error!( '403 Forbidden', 403 ) unless onglet.allow?( user, :write )

            new_right = {}
            [ :uid, :profil_id, :read, :write ].each do |key|
              new_right[ key ] = params[ key ] if params.key?( key )
            end

            onglet.add_droit( new_right )
          end

          app.put "#{APP_PATH}/api/carnets/:uid_eleve/onglets/:onglet_id/droits/:droit_id" do
            param :uid_eleve, String, required: true
            param :onglet_id, Integer, required: true
            param :droit_id, Integer, required: true
            param :uid, String, required: false
            param :profil_id, String, required: false
            param :read, Boolean, required: false
            param :write, Boolean, required: false

            # FIXME
          end

          app.delete "#{APP_PATH}/api/carnets/:uid_eleve/onglets/:onglet_id/droits/:droit_id" do
            param :uid_eleve, String, required: true
            param :onglet_id, Integer, required: true
            param :droit_id, Integer, required: true

            # FIXME
          end
        end
      end
  end
end
