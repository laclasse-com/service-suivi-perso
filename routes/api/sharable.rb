module Suivi
  module Routes
    module Api
      module Sharable
        def self.registered( app )
          app.get '/api/sharable/:sharable_id/?' do
            param :sharable_id, String, required: true

            json( Page.where(id: Right.where(sharable_id: params[:sharable_id] )
                                        .select(:page_id)
                                        .all
                                        .map(&:page_id)
                                        .compact )
                        .all
                        .map do |page|
                    page_hash = page.to_hash
                    page_hash[:writable] = false
                    page_hash[:uid_student] = page.uid_student

                    page_hash
                  end )
          end
        end
      end
    end
  end
end
