# coding: utf-8

# Classe d'erreur pour les opérations create/read/update/delete
class CrudError < StandardError; end

# Module de prise en charge des erreurs, log, affichage, et raising
module ErrorHandler
  def raise_crud_error(name, msg, class_name = 'noclass', error_class_name = nil)
    error = CrudError.new if error_class_name.nil?
    @logger.error MSG[LANG.to_sym][:error][:crud].sub('$1', name).sub('$2', class_name).sub('$3', msg)
    fail error, MSG[LANG.to_sym][:error][:crud].sub('$1', name).sub('$2', class_name).sub('$3', msg)
  end
end
