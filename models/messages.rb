# frozen_string_literal: true

class Message < Sequel::Model(:messages)
    many_to_many :pages, class: :Page, join_table: :messages_pages
    one_to_many :resources

    def before_destroy
        remove_all_pages
        remove_all_resources
    end

    def allow?( user, asked_right )
        return true if asked_right == :read

        return true if user['id'] == uid_author

        # if user can manage then she can edit page's message(s)
        return true if pages.reduce( true ) do |memo, page|
            memo && Page[id: page.id].allow?( user, :manage )
        end

        # by default etablissement's admins and super-admins have all rights
        LaClasse::User.admin?( user ) || LaClasse::User.super_admin?( user )
    end

    def to_json( arg )
        h = to_hash
        h[:ctime] = DateTime.parse( h[:ctime].to_s ) unless h[:ctime].nil?
        h[:mtime] = DateTime.parse( h[:mtime].to_s ) unless h[:mtime].nil?

        h.to_json( arg )
    end
end
