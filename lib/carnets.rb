# Module d'interfaçage avec l'annuaire
module CarnetsLib
  module_function

  include AuthenticationHelpers

  def search_carnets_of response_annuaire, evignal=false
      
    carnets = []
    response_annuaire.each do |reponse|
      carnet = Carnet.new(nil, reponse['id_ent'])
      if carnet.exist?
        carnet.read
      end
      if evignal
        etablissement_nom = reponse['classes'][0]['etablissement_nom']
        !carnet.id.nil? && carnet.evignal == true ? active = true : active = false
      else
        etablissement_nom = nil
        !carnet.id.nil? ? active = true : active = false
      end
  		carnets.push({
  			id: carnet.id,
  			couleur: nil,
  			uid_elv: reponse['id_ent'],
  			firstName: reponse['prenom'],
  			lastName: reponse['nom'],
  			classe: reponse['classes'][0]['classe_libelle'],
  			classe_id: reponse['classes'][0]['classe_id'],
  			etablissement_code: reponse['classes'][0]['etablissement_code'],
        etablissement_nom: etablissement_nom,
  			avatar: reponse["avatar"],
  			active: active
  			})
  	end
  	carnets
  end

  def get_carnets_by_classe_of response_annuaire
  	carnets = []
  	# info sur la classe
  	classe = {
  		id: response_annuaire['id'], 
  		couleur: nil, 
  		name: response_annuaire['libelle_aaf'], 
  		college: response_annuaire["etablissement"]['nom'], 
  		collegeId: response_annuaire["etablissement"]['id'],
  		college_code: response_annuaire["etablissement"]['code_uai']
  	}
  	carnets.push(classe)
  	response_annuaire['eleves'].each do |reponse|
      puts reponse['avatar'].inspect
  		carnet = Carnet.new(nil, reponse['id_ent'])
  		if carnet.exist?
  			carnet.read
	  		carnets.push({
	  			id: carnet.id,
	  			couleur: nil,
	  			uid_elv: reponse['id_ent'],
	  			firstName: reponse['prenom'],
	  			lastName: reponse['nom'],
	  			classe: response_annuaire['libelle_aaf'],
	  			classe_id: response_annuaire['id'],
	  			etablissement_code: response_annuaire["etablissement"]['code_uai'],
	  			avatar: reponse['avatar'],
	  			active: !carnet.id.nil?
	  		})
  		end
  	end
  	carnets
  end

  def get_evignal_carnets
    carnets = []
    uids = []
    Carnets.where(:evignal => true).each do |carnet|
      uids.push carnet.uid_elv
      carnets.push({
        id: carnet.id,
        couleur: nil,
        uid_elv: carnet.uid_elv,
        firstName: nil,
        lastName: nil,
        classe: nil,
        classe_id: carnet.cls_id,
        etablissement_code: carnet.uai,
        avatar: nil,
      })
    end
    response = []
    response = Annuaire.send_request_signed(:service_annuaire_user, ANNUAIRE_URL[:user_liste] + uids.join(";").to_s, {'expand' => 'true'}) if !uids.empty?
    response.each do |user|
      carnets.each do |carnet|
        if carnet[:uid_elv] == user["id_ent"]
          carnet[:firstName] = user["prenom"]
          carnet[:lastName] = user["nom"]
          carnet[:avatar] = user["avatar"]
        end
      end
    end
    carnets
  end

  def get_tabs uid_elv, id_onglets=nil, url_pub=nil
    onglets = []
    carnet = Carnet.new(nil, uid_elv)
    carnet.read
    carnet.get_onglets.each do |tab|
      if (id_onglets.nil? || id_onglets.include?(tab.id)) && (url_pub.nil? || url_pub == tab.url_pub) 
        entrees = []
        tab.get_entrees.each do |e|
          entrees.push ({
            id: e.id,
            owner: {
              uid: e.uid,
              infos: e.infos_owner,
              avatar: e.avatar,
              avatar_color: e.avatar_color,
              back_color: e.back_color
            },
            contenu: e.contenu,
            date: e.date_modification
          })
        end
        onglets.push ({
          id: tab.id,
          carnet_id: tab.id_carnet,
          nom: tab.nom,
          owner: tab.uid_own,
          ordre: tab.ordre,
          editable: false,
          active: tab.ordre == 1,
          htmlcontent: "",
          modifEntree: nil,
          entrees: entrees
        })
      end
    end
    onglets.sort_by {|o| o[:ordre]}
  end

  def last_carnet_model old_carnet, new_carnet
    #récupérer ses onglets
    old_onglets = old_carnet.get_onglets
    #créer les nouveaux onglets par rapport a ceux du dernier carnet
    old_onglets.each do |old_onglet|
      new_onglet = Onglet.new(nil, new_carnet.id, old_onglet.nom, new_carnet.uid_adm, old_onglet.ordre)
      new_onglet.create
    end
  end


 #  #initialise le current_user s'il ne l'est pas 
 #  def set_current_user(current_user)
 #  	if @current_user.nil?
 #  		@current_user = current_user
 #  	end
 #  end

 #  def get_carnets_of_classe id

 #  end

 #  #Retourne une liste de carnets correspondant aux ids en paramètres
	# def list_carnets(carnetsIds)
	# 	carnets = []
 #  		carnetsIds.each do |id|
 #  			carnet = get_carnet_of id
 #  			carnets.push carnet	if !carnet.empty?  			
 #  		end
	#   	if carnets.size < 16
	#   		for i in carnets.size .. 15 
	#   			carnets.push carnet_vide
	#   		end
	#   	end
	#   	#on rempli les couleur des carnets
	#   	couleurs_carnets(carnets, true)
	# end

	# #retourne le carnet de l'id_carnet en paramètre dans une hash map 
	# def get_carnet_of(id_carnet)
	# 	carnet = Carnets[:id => id_carnet]
	# 	carnet_hash = {}
	# 	if !carnet.nil?
	# 		carnet_hash[:color] = ''
	# 		carnet_hash[:avatar] = ''
	# 		carnet_hash[:uid] = carnet.uid
	# 		carnet_hash[:nom] = carnet.nom
	# 		carnet_hash[:prenom] = carnet.prenom
	# 		carnet_hash[:etablissement] = carnet.etablissement
	# 		carnet_hash[:classe] = carnet.classe
	# 		carnet.sexe == 'F' ? carnet_hash[:sexe] = SVG_AVATAR_F : carnet_hash[:sexe] = SVG_AVATAR_M
	# 	end
	# 	carnet_hash
	# end

	# #creer des carnets vide pour l'interface
	# def carnet_vide
	# 	carnet_hash = {}
	# 	carnet_hash[:color] = ''
	# 	carnet_hash[:avatar] = ''
	# 	carnet_hash[:sexe] = ''
	# 	carnet_hash[:uid] = ''
	# 	carnet_hash[:nom] = ' '
	# 	carnet_hash[:prenom] = ' '
	# 	carnet_hash[:etablissement] = ''
	# 	carnet_hash[:classe] = ''
		
	# 	carnet_hash
	# end

	# #regarde si l'uid d'un utilisateur a les droits sur le carnet d'un élève
	# def rights_on(uid_elv, uid_user)
	# 	carnet_elv = Carnets[:uid => uid_elv]
	# 	response = false
	# 	if !carnet_elv.nil?
	# 		response = true if !Rights[:uid => uid_user, :carnets_id => carnet_elv.id].nil?
	# 		response = true if uid_user == uid_elv
	# 	end
	# 	response
	# end

	# #ajoute les couleurs des carnets et de leur avatar par défaut si besoin
	# def couleurs_carnets(carnets, need_avatar)
	# 	color = 0
	# 	carnets.each do |carnet|
	# 		carnet[:color] = PANEL_COLOR[color]
	# 		if carnet[:nom] == ' ' && need_avatar
	# 			carnet[:avatar] = PANEL_COLOR[color]
	# 		else
	# 			carnet[:avatar] = couleur_avatar PANEL_COLOR[color] if need_avatar
	# 		end
	# 		color += 1
	# 		color = 0 if color == 16
	# 	end
	# 	carnets
	# end

	# #choisi la bonne couleur de l'avatar par rapport a la couleur du carnet
	# def couleur_avatar(color_carnet)
	# 	prng = Random.new
	# 	avatar = COLOR[:jaune]
	# 	case color_carnet
	# 	when COLOR[:jaune]
	# 		colors = [COLOR[:rouge], COLOR[:violet], COLOR[:bleu]]
	# 		avatar = colors[prng.rand(0..2)]
	# 	when COLOR[:vert]
	# 		colors = [COLOR[:jaune], COLOR[:rouge]]
	# 		avatar = colors[prng.rand(0..1)]
	# 	when COLOR[:rouge]
	# 		colors = [COLOR[:jaune], COLOR[:vert]]
	# 		avatar = colors[prng.rand(0..1)]
	# 	end
	# 	avatar
	# end

	# #créé un carnet dans la base de Donnée
	# def create(uid)
	# 	Annuaire.checkAdmin uid, 3
	# end
end