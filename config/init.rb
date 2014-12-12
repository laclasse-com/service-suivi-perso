# -*- coding: utf-8 -*-

puts "loading config/database"
require __DIR__('database')

puts "loading config/constants"
require __DIR__('constants')

puts "loading config/rights_constants"
require __DIR__('rights_constants')

puts "loading config/options"
require __DIR__('options')
