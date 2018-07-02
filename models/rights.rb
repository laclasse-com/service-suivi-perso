# frozen_string_literal: true

class Right < Sequel::Model(:rights)
    many_to_one :pages
end
