# coding: utf-8

namespace :preprocess_assets do
  desc 'Compile typescript files'
  task :ts2js do
    require_relative '../config/options'

    puts `cd #{APP_ROOT}/public/app/js/ && tsc`
  end

  desc 'Do what needs to be done for production environment'
  task production: [:ts2js]
end

task preprocess_assets: ['preprocess_assets:production']
