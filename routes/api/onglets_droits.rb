# -*- coding: utf-8 -*-

module Suivi
  module Routes
    module Api
      module Onglets
        module Droits
          def self.registered( app )
            app.get "#{APP_PATH}/api/carnets/:uid_eleve/onglets/:onglet_id/droits" do
              param :uid_eleve, String, required: true
              param :onglet_id, Integer, required: true

              get_and_check_carnet( params[:uid_eleve], :write )

              onglet = get_and_check_onglet( params[:onglet_id], :write )

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

              get_and_check_carnet( params[:uid_eleve], :write )
              onglet = get_and_check_onglet( params[:onglet_id], :write )

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

              error!( '400 missing parameter', 400 ) unless ( params.key?(:uid) || params.key?(:profil_id) ) && ( params.key?(:read) || params.key?(:write) )

              get_and_check_carnet( params[:uid_eleve], :write )
              get_and_check_onglet( params[:onglet_id], :write )

              droit = Droit[params[:droit_id]]
              error!( '404 Unknown droit', 404 ) if droit.nil?

              [ :uid, :profil_id, :read, :write ].each do |key|
                droit[ key ] = params[ key ]
              end
              droit.save

              droit
            end

            app.delete "#{APP_PATH}/api/carnets/:uid_eleve/onglets/:onglet_id/droits/:droit_id" do
              param :uid_eleve, String, required: true
              param :onglet_id, Integer, required: true
              param :droit_id, Integer, required: true

              get_and_check_carnet( params[:uid_eleve], :write )
              get_and_check_onglet( params[:onglet_id], :write )

              droit = Droit[params[:droit_id]]
              error!( '404 Unknown droit', 404 ) if droit.nil?

              droit.destroy
            end
          end
        end
      end
    end
  end
end
