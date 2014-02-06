# -*- coding: utf-8 -*-

puts "loading config/env"
require __DIR__('env')

puts "loading config/database"
require __DIR__('database')

puts "loading config/constants"
require __DIR__('constants')

puts "loading config/cas_server"
require __DIR__('cas_server')
