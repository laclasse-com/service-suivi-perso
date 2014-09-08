# Module d'interfaçage avec l'annuaire
module CarnetsLib
  module_function

  include AuthenticationHelpers

  #initialise le current_user s'il ne l'est pas 
  def set_current_user(current_user)
  	if @current_user.nil?
  		@current_user = current_user
  	end
  end

  	#Retourne une liste de carnets correspondant aux ids en paramètres
	def list_carnets(carnetsIds)
		carnets = []
  		carnetsIds.each do |id|
  			carnet = get_carnet_of id
  			carnets.push carnet	if !carnet.empty?  			
  		end
	  	if carnets.size < 16
	  		for i in carnets.size .. 15 
	  			carnets.push carnet_vide
	  		end
	  	end
	  	#on rempli les couleur des carnets
	  	couleurs_carnets(carnets, true)
	end

	#retourne le carnet de l'id_carnet en paramètre dans une hash map 
	def get_carnet_of(id_carnet)
		carnet = Carnets[:id => id_carnet]
		carnet_hash = {}
		if !carnet.nil?
			carnet_hash[:color] = ''
			carnet_hash[:avatar] = ''
			carnet_hash[:uid] = carnet.uid
			carnet_hash[:nom] = carnet.nom
			carnet_hash[:prenom] = carnet.prenom
			carnet_hash[:etablissement] = carnet.etablissement
			carnet_hash[:classe] = carnet.classe
			carnet.sexe == 'F' ? carnet_hash[:sexe] = SVG_AVATAR_F : carnet_hash[:sexe] = SVG_AVATAR_M
		end
		carnet_hash
	end

	#creer des carnets vide pour l'interface
	def carnet_vide
		carnet_hash = {}
		carnet_hash[:color] = ''
		carnet_hash[:avatar] = ''
		carnet_hash[:sexe] = ''
		carnet_hash[:uid] = ''
		carnet_hash[:nom] = ' '
		carnet_hash[:prenom] = ' '
		carnet_hash[:etablissement] = ''
		carnet_hash[:classe] = ''
		
		carnet_hash
	end

	#regarde si l'uid d'un utilisateur a les droits sur le carnet d'un élève
	def rights_on(uid_elv, uid_user)
		carnet_elv = Carnets[:uid => uid_elv]
		response = false
		if !carnet_elv.nil?
			response = true if !Rights[:uid => uid_user, :carnets_id => carnet_elv.id].nil?
			response = true if uid_user == uid_elv
		end
		response
	end

	#ajoute les couleurs des carnets et de leur avatar par défaut si besoin
	def couleurs_carnets(carnets, need_avatar)
		color = 0
		carnets.each do |carnet|
			carnet[:color] = PANEL_COLOR[color]
			if carnet[:nom] == ' ' && need_avatar
				carnet[:avatar] = PANEL_COLOR[color]
			else
				carnet[:avatar] = couleur_avatar PANEL_COLOR[color] if need_avatar
			end
			color += 1
			color = 0 if color == 16
		end
		carnets
	end

	#choisi la bonne couleur de l'avatar par rapport a la couleur du carnet
	def couleur_avatar(color_carnet)
		prng = Random.new
		avatar = COLOR[:jaune]
		case color_carnet
		when COLOR[:jaune]
			colors = [COLOR[:rouge], COLOR[:violet], COLOR[:bleu]]
			avatar = colors[prng.rand(0..2)]
		when COLOR[:vert]
			colors = [COLOR[:jaune], COLOR[:rouge]]
			avatar = colors[prng.rand(0..1)]
		when COLOR[:rouge]
			colors = [COLOR[:jaune], COLOR[:vert]]
			avatar = colors[prng.rand(0..1)]
		end
		avatar
	end

	#créé un carnet dans la base de Donnée
	def create(uid)
		Annuaire.checkAdmin uid, 3
	end
end