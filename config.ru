require_relative './app'

# vv merge POST/... body into params
use Rack::NestedParams
use Rack::PostBodyContentTypeParser

map "#{APP_PATH}/" do
  run SinatraApp
end
