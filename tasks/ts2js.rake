# coding: utf-8

desc 'Compile typescript files'
task :ts2js do
  require_relative '../config/options'

  puts `find #{APP_ROOT}/public/app/ -type f -name \\*.ts -not -path "#{APP_ROOT}/public/app/node_modules/*" -exec tsc --allowJs {} \\;`
end
