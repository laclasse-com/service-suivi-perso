# coding: utf-8

namespace :preprocess_assets do
  desc 'Load config'
  task :load_config do
    require_relative '../config/options'
  end

  desc 'Clean away compiled files'
  task clean: [:load_config] do
    file = "#{APP_ROOT}/public/app/js/suiviApp.js"
    puts `[ -e #{file} ] && rm #{file}`
  end

  desc 'Compile typescript files'
  task ts2js: [:load_config] do
    puts `tsc --project #{APP_ROOT}/public/app/js/tsconfig.json`
  end

  desc 'Do what needs to be done for production environment'
  task production: [:ts2js]
end

task preprocess_assets: ['preprocess_assets:production']
