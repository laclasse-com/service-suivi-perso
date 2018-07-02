# frozen_string_literal: true

module Suivi
    module Helpers
        module AccessAndRights
            def get_and_check_page( id, user, right )
                page = Page[id: id]
                halt( 404, '404 Unknown page' ) if page.nil?
                halt( 403, '403 Forbidden' ) unless page.allow?( user, right )

                page
            end

            def get_and_check_students_pages( uid_student, user, right )
                Page.where(uid_student: uid_student)
                    .all
                    .select { |page| page.allow?( user, right ) }
            end

            def get_and_check_message( id, user, right )
                message = Message[id: id]
                halt( 404, '404 Unknown message' ) if message.nil?
                halt( 403, '403 Forbidden' ) unless message.allow?( user, right )

                message
            end

            def get_notebook( id, user )
                notebook = Notebook[id: id]
                halt( 404, '404 Unknown notebook' ) if notebook.nil?
                halt( 403, '403 Forbidden' ) unless notebook.owner == user.id

                notebook
            end
        end
    end
end
