# coding: utf-8

require 'rubygems'
require 'bundler'
require 'sinatra/reloader'

Bundler.require(:default, :development) # require tout les gems définis dans Gemfile

# DIR Method
def __dir__(*args)
  filename = caller[0][/^(.*):/, 1]
  dir = File.expand_path(File.dirname(filename))
  ::File.expand_path(::File.join(dir, *args.map(&:to_s)))
end

require 'laclasse/helpers/app_infos'

puts '----------> configs <----------'
require __dir__('config/init')
puts '----------> libs <-------------'
require __dir__('lib/init')
puts '----------> models <-----------'
require __dir__('model/init')
puts '----------> objects <-----------'
require __dir__('objects/init')
puts '----------> api <--------------'
require __dir__('api/init')
puts '----------> controllers <------'
require __dir__('controller/init')
