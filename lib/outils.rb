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
      raise_err name, 'missingParameter'
    end
    case constraint
    when :not_empty then
      if params[name].empty?
        raise_err name, 'parameterShouldNotBeEmpty'
      end
    when :false then
      unless params[name]
        raise_err name, 'parameterShouldNotBeFalse'
      end
    when :true then
      if params[name]
        raise_err name, 'parameterShouldNotBeTrue'
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

  def raise_err(name, msg)
    Logger.new(STDOUT).error MSG[LANG.to_sym][:error][msg.to_sym].sub('$1', name.to_s)
    fail ArgumentError, MSG[LANG.to_sym][:error][msg.to_sym].sub('$1', name.to_s)
  end
end
