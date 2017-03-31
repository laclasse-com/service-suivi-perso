# coding: utf-8

ENV['RACK_ENV'] = 'development'

task :load_config do
  require_relative '../app'
end

desc 'Open pry with app environment'
task pry: :load_config do
  pry.binding
end
