# coding: utf-8

namespace :preprocess_assets do
  desc 'Load config'
  task :load_config do
    require_relative '../config/options'
    COMPILED_FILE = "#{APP_ROOT}/public/app/js/app.js".freeze
    MINIFIED_FILE = "#{APP_ROOT}/public/app/js/app.min.js".freeze
  end

  desc 'Clean away compiled files'
  task clean: [:load_config] do
    puts `[ -e #{COMPILED_FILE} ] && rm #{COMPILED_FILE}`
    puts `[ -e #{MINIFIED_FILE} ] && rm #{MINIFIED_FILE}`
  end

  desc 'Compile typescript files'
  task ts2js: [:load_config] do
    puts "Compiling into #{COMPILED_FILE}"
    puts `#{APP_ROOT}/public/app/node_modules/.bin/tsc --project #{APP_ROOT}/public/app/js/tsconfig.json`
  end

  desc 'Minify compiled file'
  task minify: [:load_config, :ts2js] do
    puts "Minifying into #{MINIFIED_FILE}"
    puts `#{APP_ROOT}/public/app/node_modules/.bin/google-closure-compiler-js #{COMPILED_FILE} > #{MINIFIED_FILE}`
  end

  desc 'Do what needs to be done for production environment'
  task production: [:minify]
end

task preprocess_assets: ['preprocess_assets:production']
