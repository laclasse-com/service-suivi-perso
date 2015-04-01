# A sample Guardfile
# More info at https://github.com/guard/guard#readme
#
# Lancer avec la commande "guard -n f" pour eviter les notifications
# qui ne fonctionnent pas sous MacOS
#

# notification :growl_notify
# notification :gntp
# notification :growl

guard :rspec, cmd: 'bundle exec rspec', title: 'service-suivi-perso',
              all_after_pass: false, all_on_start: false, failed_mode: :keep do
  watch(%r{^spec/.+_spec\.rb$})
  watch(%r{^lib/(.+)\.rb$})     { |m| "spec/lib/#{m[1]}_spec.rb" }
  watch(%r{^api/(.+)\.rb$})     { |m| "spec/api/#{m[1]}_spec.rb" }
  watch('spec/spec_helper.rb')  { 'spec' }
end

group :frontend do
  guard :bundler do
    watch('Gemfile')
  end
end
