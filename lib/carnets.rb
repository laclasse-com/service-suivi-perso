# Module d'interfaçage avec l'annuaire
module CarnetsLib
  module_function

  include AuthenticationHelpers

  #initialise le current_user s'il ne l'est pas 
  def set_current_user
  	if @current_user.nil?
  		@current_user = AuthenticationHelpers.get_current_user
  	end
  end

  	#Retourne une liste de carnets correspondant aux ids en paramètres
	def list_carnets(carnetsIds)
		carnets = []
	  	if !carnetsIds.nil?
	  		carnetsIds.each do |id|
	  			carnet = Carnets[:id => id]
	  			carnet.uid == @current_user[:info].uid ? title = "Mon Carnet" : title = "Carnet"
	  			carnets.push({
	  				:title => title,
	  				:nom => carnet.nom,
	  				:prenom => carnet.prenom,
	  				:etablissement => carnet.etablissement,
	  				:classe => carnet.classe
	  			})
	  		end
	  	end
	  	carnets
	end
end