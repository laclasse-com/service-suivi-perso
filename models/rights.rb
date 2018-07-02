class Right < Sequel::Model(:rights)
  many_to_one :pages
end
