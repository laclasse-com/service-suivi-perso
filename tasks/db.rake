# coding: utf-8

# APP_ROOT_RAKE = File.expand_path(File.join(File.dirname(__FILE__), '..'))

namespace :db do
  task :load_config do
    require 'sequel'
    require './config/database'
  end

  desc 'Checks if a migration is needed'
  task check_migrate: :load_config do
    Sequel.extension :migration
    exit Sequel::Migrator.is_current?(Sequel::Model.db, 'migrations') ? 0 : 1
  end

  desc 'Apply migrations'
  task migrations: :load_config do
    Sequel::Migrator.run( DB, 'migrations' )
  end

  desc 'Apply migrations (alias)'
  task migrate: :migrations
end
