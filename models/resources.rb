# frozen_string_literal: true

class Resource < Sequel::Model(:resources)
    many_to_one :messages
    many_to_one :pages
end
