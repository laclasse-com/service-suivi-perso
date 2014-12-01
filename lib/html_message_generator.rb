#coding: utf-8
require 'htmlentities'

module HtmlMessageGenerator
	def HtmlMessageGenerator.generateHtmlCover nom, prenom, sexe, classe, avatar, college
    page = ""
    avatar = "api/default_avatar/avatar_neutre.svg"
    avatar = "api/default_avatar/avatar_feminin.svg" if sexe == "F"
    avatar = "api/default_avatar/avatar_masculin.svg" if sexe == "M"
    avatar = "<img src='"+URL_ENT+avatar+"' style='text-align: center; width:400px; height:400px; background-color:rgba(128,186,102,0.7)'/>"
    info = "<div class='eleve-info'><div><span>"+prenom+" "+nom+"</span></div><div><span>"+classe+"</span></div><div><span>"+college+"</span></div></div>"
    titre = "<h1 class='titre'>Suivi de l'année scolaire "+Outils::annee_scolaire_string+"</h1>"

    page = avatar + info + titre
		html = HTMLEntities.new.decode page
  	document = Nokogiri::HTML(html)
  	document
	end

	def HtmlMessageGenerator.generateHtmlOnglet onglet
    page = ""
    onglet_html = "<h3>"+onglet[:nom]+"</h3><hr></hr>"
    messages_html = ""
    onglet[:entrees].each do |message|
      # p message.inspect
      messages_html += "<div class='message' style='background-color:"+message[:owner][:back_color]+"'>"+
      "<div class='message-info'>"+
        "<div class='message-info-profil'><span>"+message[:owner][:infos]+"</span></div>"+
        "<div class='message-info-date'><span>"+message[:date].strftime("%d/%m/%Y - %kh%M")+"</span></div>"+
      "</div>"+
        "<div class='message-text'>"+message[:contenu]+"</div>"+
      "</div><br></br>"
    end
    page = onglet_html + messages_html + "<br></br>"
    html = HTMLEntities.new.decode page
    document = Nokogiri::HTML(html)
    document 
	end
end