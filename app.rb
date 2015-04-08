# coding: utf-8

require 'rubygems'
require 'bundler'
require 'sinatra/reloader'

Bundler.require(:default, :development)     # require tout les gems définis dans Gemfile

# DIR Method
def __DIR__(*args)
  filename = caller[0][/^(.*):/, 1]
  dir = File.expand_path(File.dirname(filename))
  ::File.expand_path(::File.join(dir, *args.map(&:to_s)))
end

require 'laclasse/helpers/app_infos'

puts '----------> configs <----------'
require __DIR__('config/init')
puts '----------> helpers <----------'
require __DIR__('helpers/init')
puts '----------> libs <-------------'
require __DIR__('lib/init')
puts '----------> models <-----------'
require __DIR__('model/init')
puts '----------> objects <-----------'
require __DIR__('objects/init')
puts '----------> api <--------------'
require __DIR__('api/init')
puts '----------> controllers <------'
require __DIR__('controller/init')
