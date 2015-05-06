# -*- coding: utf-8 -*-

puts 'loading config/constants'
require __dir__('constants')

puts 'loading config/options'
require __dir__('options')

puts 'loading config/database'
require __dir__('database')

require_relative './common'
