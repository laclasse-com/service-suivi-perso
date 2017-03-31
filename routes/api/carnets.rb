# -*- coding: utf-8 -*-

module Suivi
  module Routes
    module Api
      module Carnets
        def self.registered( app )
          app.get "#{APP_PATH}/api/carnets/contributed/:uid" do
            param :uid, String, required: true

            error!( '401', 401 ) if params[:uid] != user[:uid]

            Carnet.where( id: Onglet.where( id: Saisie.where( uid: params[:uid] ).select( :onglet_id ).all.map(&:onglet_id) ).select( :carnet_id ).all.map(&:carnet_id) )
                  .naked
                  .all
          end

          app.get "#{APP_PATH}/api/carnets/:uid_eleve" do
            param :uid_eleve, String, required: true

            carnet = Carnet.of( params[:uid_eleve] )
            error!( '404 Unknown carnet', 404 ) if carnet.nil?
            error!( '403 Forbidden', 403 ) unless carnet.allow?( user, :read )

            carnet
          end

          app.put "#{APP_PATH}/api/carnets/:uid_eleve" do
            param :uid_eleve, String, required: true
            param :sharable_id, String, required: false

            carnet = Carnet.of( params[:uid_eleve] )
            error!( '404 Unknown carnet', 404 ) if carnet.nil?
            error!( '403 Forbidden', 403 ) unless carnet.allow?( user, :write )

            carnet.sharable_id = params[:sharable_id] if params.key?( :sharable_id )
            carnet.save

            carnet
          end
        end
      end
    end
  end
end

# app.get "#{APP_PATH}/api/carnets/:uid_eleve/pdf" do
#   param :uid_eleve, String, required: true
#   param :onglets_ids, Array, required: true
#   param :evignal, Boolean, required: false, default: false

#   # TODO: error!( 'Unknown Carnet', 404 ) if invalid_uid_eleve
#   # TODO: check read rights of onglets
#   carnet = Carnet[ uid_eleve: params[:uid_eleve] ]

#   onglets = CarnetsLib.tab_list( params[:uid_eleve], params[:id_onglets].map( &:id ) )
#   final_document = PdfGenerator.generate_pdf( params[:nom],
#                                               params[:prenom],
#                                               params[:sexe],
#                                               params[:classe],
#                                               params[:avatar],
#                                               params[:college],
#                                               onglets )

#   # generate pdf
#   kit = PDFKit.new( final_document, page_size: 'A4' )

#   kit.stylesheets << 'public/app/css/pdf/pdf.css'

#   content_type 'application/pdf'
#   kit.to_pdf
# end

# FIXME: belongs here?
# desc 'envoi un email a chaque destinataire'
# params do
#   requires :mail_infos, type: Object
#   optional :file, type: Object
# end
# post '/email' do
#   file = {name: params[:file][:filename], path: params[:file][:tempfile].path} unless params[:file].nil?
#   infos = JSON.parse(params[:mail_infos])
#   MailGenerator.send_emails infos['uid_exp'], infos['destinataires']['list'], infos['objet'], infos['message'], file
# end
