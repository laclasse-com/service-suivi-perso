# coding: utf-8
require 'logger'
require 'date'
require 'digest'

# diverses fonctions utiles
module Outils
  # Fonction de vérification des paramètres requis
  # Ex : requires params, :target, :not_empty
  def requires(params, name, constraint = nil)
    raise_err name, 'missingParameter' if params[name].nil?
    case constraint
    when :not_empty then
      raise_err name, 'parameterShouldNotBeEmpty' if params[name].empty?
    when :false then
      raise_err name, 'parameterShouldNotBeFalse' unless params[name]
    when :true then
      raise_err name, 'parameterShouldNotBeTrue' if params[name]
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
    raise ArgumentError, MSG[LANG.to_sym][:error][msg.to_sym].sub('$1', name.to_s)
  end
end
