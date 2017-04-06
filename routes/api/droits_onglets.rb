# -*- coding: utf-8 -*-

module Suivi
  module Routes
    module Api
      module Onglets
        module Droits
          def self.registered( app )
            app.get '/api/carnets/:uid_eleve/onglets/:onglet_id/droits/?' do
              param :uid_eleve, String, required: true
              param :onglet_id, Integer, required: true

              get_and_check_carnet( params['uid_eleve'], user, :write )

              onglet = get_and_check_onglet( params['onglet_id'], user, :write )

              json( onglet.droits )
            end

            app.post '/api/carnets/:uid_eleve/onglets/:onglet_id/droits/?' do
              param :uid_eleve, String, required: true
              param :onglet_id, Integer, required: true

              param :uid, String, required: false
              param :profil_id, String, required: false
              param :read, :boolean, required: false
              param :write, :boolean, required: false

              halt( 400, '400 missing parameter' ) unless ( params.key?('uid') || params.key?('profil_id') ) && ( params.key?('read') || params.key?('write') )

              get_and_check_carnet( params['uid_eleve'], user, :write )
              onglet = get_and_check_onglet( params['onglet_id'], user, :write )

              droit = Droit[uid: params['uid'], profil_id: params['profil_id'], read: params['read'], write: params['write']]
              return json( droit ) unless droit.nil?

              new_right = {}
              %w(uid profil_id read write).each do |key|
                new_right[ key ] = params[ key ] if params.key?( key )
              end

              json( onglet.add_droit( new_right ) )
            end

            app.put '/api/carnets/:uid_eleve/onglets/:onglet_id/droits/:droit_id' do
              param :uid_eleve, String, required: true
              param :onglet_id, Integer, required: true
              param :droit_id, Integer, required: true

              param :uid, String, required: false
              param :profil_id, String, required: false
              param :read, :boolean, required: false
              param :write, :boolean, required: false

              halt( 400, '400 missing parameter' ) unless ( params.key?('uid') || params.key?('profil_id') ) && ( params.key?('read') || params.key?('write') )

              get_and_check_carnet( params['uid_eleve'], user, :write )
              get_and_check_onglet( params['onglet_id'], user, :write )

              droit = Droit[params['droit_id']]
              halt( 404, '404 Unknown droit' ) if droit.nil?

              [ :uid, :profil_id, :read, :write ].each do |key|
                droit[ key ] = params[ key ]
              end
              droit.save

              json( droit )
            end

            app.delete '/api/carnets/:uid_eleve/onglets/:onglet_id/droits/:droit_id' do
              param :uid_eleve, String, required: true
              param :onglet_id, Integer, required: true
              param :droit_id, Integer, required: true

              get_and_check_carnet( params['uid_eleve'], user, :write )
              get_and_check_onglet( params['onglet_id'], user, :write )

              droit = Droit[params['droit_id']]
              halt( 404, '404 Unknown droit' ) if droit.nil?

              json( droit.destroy )
            end
          end
        end
      end
    end
  end
end
