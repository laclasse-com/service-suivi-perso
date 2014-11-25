#coding: utf-8
require 'htmlentities'

module HtmlMessageGenerator
	def HtmlMessageGenerator.generateHtmlCover nom, prenom, sexe, classe, college
    page = ""
    # avatar = "<img src='http://127.0.0.1:9292/v3/suivi/app/images/yeoman.png' style='width:100px; height:100px'/>"
    info = "<div class='eleve-info'><div><span>"+prenom+" "+nom+"</span></div><div><span>"+classe+"</span></div><div><span>"+college+"</span></div></div>"
    titre = "<h1 class='titre'>Suivi de l'année scolaire "+Outils::annee_scolaire_string+"</h1>"

    page = info + titre
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