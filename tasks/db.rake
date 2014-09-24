# coding: utf-8
#APP_ROOT_RAKE = File.expand_path(File.join(File.dirname(__FILE__), '..'))

namespace :db do
  task :load_config do
    require 'sequel'
    require './config/database'
  end

  desc 'Configuring database server.'
  task :configure do
    require 'erb'
    File.open(File.join( APP_ROOT_RAKE, 'config', 'database.rb'), 'w') do |new_file|
      new_file.write ERB.new(File.read(File.join(APP_ROOT_RAKE, 'config', 'database.erb'))).result(binding)
    end
  end

  desc 'Dumps the schema to db/schema/sequel_schema.db'
  task schemadump: :load_config do
    require './config/database'
    DB.extension :schema_dumper
    # foreign_key dump is sometimes wrong with non autoincrmente type (ie char)
    # so we need to dump the base in two times : the structure without foreign_keys and the foreigne_key alone
    schema = DB.dump_schema_migration(foreign_key: false)
    File.open(File.join(APP_ROOT_RAKE, 'db', 'scripts', 'dump_db_schema.rb'), 'w'){|f| f.write(schema)}
    fk = DB.dump_foreign_key_migration
    File.open(File.join(APP_ROOT_RAKE, 'db', 'scripts', 'dump_fk.rb'), 'w'){|f| f.write(fk)}
  end

  desc 'Generating Sequel model from database.'
  task generate_model: :load_config do
    require 'model_generator'
  end

  desc 'Apply migrations'
  task migrations: :load_config do
    Sequel::Migrator.run( DB, 'migrations' )
  end

  desc 'Open pry with DB environment setup'
  task pry: :load_config do
    require 'pry'
    require 'sequel'
    require './config/database'
    require './model/init'
    pry.binding
  end
end