# coding: utf-8

desc 'Compile typescript files'
task :ts2js do
  `find public/app -type f -name \\*.ts -not -path "public/app/node_modules/*" -exec tsc --allowJs {} \\;`
end
