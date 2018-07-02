source 'https://rubygems.org'

gem 'json'
gem 'mysql2'
gem 'pry'
gem 'puma'
gem 'rack'
gem 'rack-contrib', require: 'rack/contrib'
gem 'rest-client'
gem 'sequel'
gem 'sinatra'
gem 'sinatra-contrib'
gem 'sinatra-param', require: 'sinatra/param'

group :development do
    gem 'rspec'
    gem 'rubocop'
end
