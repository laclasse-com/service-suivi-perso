#
# Rakefile
#
APP_ROOT = File.expand_path(File.join(File.dirname(__FILE__), '..'))

# DIR Method
def __DIR__(*args)
  filename = caller[0][/^(.*):/, 1]
  dir = File.expand_path(File.dirname(filename))
  ::File.expand_path(::File.join(dir, *args.map(&:to_s)))
end

task default: [:test]

desc 'Testing application.'
task :test do
end

desc 'Installing application'
task :install do
  # Adding config files from sample if not exist.
  FileUtils.cp File.join(APP_ROOT, 'config', 'common.rb.sample'), File.join(APP_ROOT, 'config', 'common.rb') unless File.exist? File.join(APP_ROOT, 'config', 'common.rb')
  FileUtils.cp File.join(APP_ROOT, 'config', 'database.sample'), File.join(APP_ROOT, 'config', 'database.rb') unless File.exist? File.join(APP_ROOT, 'config', 'database.rb')
  FileUtils.cp File.join(APP_ROOT, 'config', 'cas_server.sample'), File.join(APP_ROOT, 'config', 'cas_server.rb') unless File.exist? File.join(APP_ROOT, 'config', 'cas_server.rb')

  require_relative '../config/constants'
  require_relative '../config/env'

  # Creating applcation directoies.
  FileUtils.mkdir File.join(APP_ROOT, STORAGE_DIR)    unless File.exist? File.join(APP_ROOT, STORAGE_DIR)
  FileUtils.mkdir File.join(APP_ROOT, TEMP_DIRECTORY) unless File.exist? File.join(APP_ROOT, TEMP_DIRECTORY)
end

namespace :db do
  task :load_config do
    puts APP_ROOT
    require(File.join(APP_ROOT, 'app'))
  end

  desc 'Configuring database server.'
  task :configure do
    require 'erb'
    File.open(File.join(APP_ROOT, 'config', 'database.rb'), 'w') do |new_file|
      new_file.write ERB.new(File.read(File.join(APP_ROOT, 'config', 'database.erb'))).result(binding)
    end
  end

  desc 'Dumps the schema to db/schema/sequel_schema.db'
  task schemadump: :load_config do
    # foreign_key dump is sometimes wrong with non autoincrmente type (ie char)
    # so we need to dump the base in two times : the structure without foreign_keys and the foreigne_key alone
    schema = DB.dump_schema_migration(foreign_key: false)
    File.open(File.join(APP_ROOT, 'db', 'scripst', 'dump_db_schema.sql'), 'w') { |f| f.write(schema) }
    fk = DB.dump_foreign_key_migration
    File.open(File.join(APP_ROOT, 'db', 'scripts', 'dump_fk.sql'), 'w') { |f| f.write(fk) }
  end

  desc 'Generating Sequel model from database.'
  task generate_model: :load_config do
    require_relative 'model_generator'
  end
end
