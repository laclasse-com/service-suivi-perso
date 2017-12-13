# coding: utf-8
#
# Configuration de la base de données de Backend

DB_CONFIG = YAML.load( File.read( "./config/database.yml" ) )
DB = Sequel.mysql2( DB_CONFIG[:name],
                    DB_CONFIG )

Sequel.extension(:migration)

Sequel::Model.plugin :json_serializer

# Uncomment this if you want to log all DB queries
# DB.loggers << Logger.new($stdout)
