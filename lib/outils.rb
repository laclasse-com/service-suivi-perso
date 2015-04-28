# coding: utf-8
require 'logger'
require 'date'
require 'digest'

# diverses fonctions utiles
module Outils
  # Fonction de vérification des paramètres requis
  # Ex : requires params, :target, :not_empty
  def requires(params, name, constraint = nil)
    if params[name].nil?
      Logger.new(STDOUT).error MSG[LANG.to_sym][:error][:missingParameter].sub('$1', name.to_s)
      fail ArgumentError, MSG[LANG.to_sym][:error][:missingParameter].sub('$1', name.to_s)
    end
    case constraint
    when :not_empty then
      if params[name].empty?
        Logger.new(STDOUT).error MSG[LANG.to_sym][:error][:parameterShouldNotBeEmpty].sub('$1', name.to_s)
        fail ArgumentError, MSG[LANG.to_sym][:error][:parameterShouldNotBeEmpty].sub('$1', name.to_s)
      end
    when :false then
      if params[name] == false
        Logger.new(STDOUT).error MSG[LANG.to_sym][:error][:parameterShouldNotBeFalse].sub('$1', name.to_s)
        fail ArgumentError, MSG[LANG.to_sym][:error][:parameterShouldNotBeFalse].sub('$1', name.to_s)
      end
    when :true then
      if params[name] == true
        Logger.new(STDOUT).error MSG[LANG.to_sym][:error][:parameterShouldNotBeTrue].sub('$1', name.to_s)
        fail ArgumentError, MSG[LANG.to_sym][:error][:parameterShouldNotBeTrue].sub('$1', name.to_s)
      end
    end unless params[name].nil?
  end

  def self::annee_scolaire_string
    annee_scolaire = (Date.today.year - 1).to_s + '-' + Date.today.year.to_s
    annee_scolaire = Date.today.year.to_s + '-' + (Date.today.year + 1).to_s if Date.today.month > 8
    annee_scolaire
  end

  def self::md5_encode(message)
    md5 = Digest::MD5.new
    md5 << message
    md5.hexdigest
  end
end
