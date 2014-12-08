#coding: utf-8
require 'htmlentities'
require 'date'

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

  def HtmlMessageGenerator.aside_public_carnet user
    sexe_date = user["sexe"] == 'F' ? 'née le ' : 'né le '
    date_naiss = Date.strptime(user['date_naissance'], "%Y-%m-%d").strftime("%d/%m/%Y")

    avatar = URL_ENT+user["avatar"]
    aside = "<div class='row carnet-eleve-contener'>"+
              "<div class='col-xs-12 col-sm-12 col-md-12 col-lg-12' >"+
                "<div class='row ' style='display: table-row'>"+
                  "<div class='col-xs-1 col-sm-1 col-md-5 col-lg-5 avatar-carnet'>"+
                    "<div class='rouge'>"+
                      "<img src='"+avatar+"'>"+
                    "</div>"+
                  "</div>"+
                  "<div class='col-xs-1 col-sm-1 col-md-7 col-lg-7 eleve-info'>"+
                    "<div class='eleve-info-firstname'>"+
                      "<span >"+user["prenom"]+"</span>"+
                    "</div>"+
                    "<div class='eleve-info-lastname'>"+
                      "<span >"+user["nom"]+"</span>"+
                    "</div>"+
                    "<div>"+
                      "<span>"+user["classes"][0]["classe_libelle"]+" - "+user["classes"][0]["etablissement_nom"]+"</span>"+
                    "</div>"+
                    "<div>"+
                      "<span>"+sexe_date+date_naiss+"</span>"+
                    "</div>"+
                  "</div>"+
                "</div>"+
              "</div>"+
            "</div>"
  end

  def HtmlMessageGenerator.main_public_carnet onglets
    # tabs = "<div class='row' style='height:100%'>"+
    #           "<div class='col-xs-12 col-sm-12 col-md-12 col-lg-12' style='height:100%; padding:0'>"+
    #              " <ul class='nav nav-tabs' role='tablist' id='myTab'>"+
    #                 "<li class='active'>"+
    #                   <a ng-click='activeTab(tab)' ng-dblclick='tab.editable=true' ng-show='!tab.editable'>{{tab.nom}} <i ng-click='open(tab, '', 'tab')' class='toolbar-suivi toolbar-suivi-del toolbar-suivi-del-carnet'></i> </a>
                      
    #                   <input type='text' class='tab-editable' ng-show='tab.editable' ng-model='tab.nom' ng-blur='changeNameTab(tab)' autofocus>             
    #                 "</li>"
    #               "</ul>"

    tabs = "<div class='row' style='height:100%'>\n"+
            "<div class='col-xs-12 col-sm-12 col-md-12 col-lg-12' style='height:100%; padding:0'>\n"+ 
              "<ul class='nav nav-tabs' role='class='active'tablist' id='myTab'>\n"
    contenu = "<div class='tab-content'>\n"
              onglets.each do |onglet|
                onglet[:ordre] == 1 ? active="active" : active=""
                tabs += "<li role='presentation' class='"+active+"'><a href='#tab"+onglet[:id].to_s+"' aria-controls='tab' role='tab' data-toggle='tab'>"+onglet[:nom]+"</a></li>\n"
                contenu += "<div role='tabpanel' class='tab-pane "+active+"' id='tab"+onglet[:id].to_s+"'>"+(HtmlMessageGenerator.main_entrees_public_carnet onglet[:entrees])+"</div>\n"
              end
                
              tabs = tabs+"</ul>\n"+contenu+
              "</div>\n"+
            "</div>\n"+
          "</div>\n"+
          "<script src='<%= APP_PATH %>/app/bower_components/jquery/dist/jquery.js'></script>\n"+
          "<script src='<%= APP_PATH %>/app/bower_components/bootstrap/dist/js/bootstrap.min.js'></script>\n"
  end

  def HtmlMessageGenerator.main_entrees_public_carnet entrees
    saisies =""
    entrees.each do |entree|
      date = entree[:date].strftime("%A %-d %B %Y - %k:%M")
      saisies += "<div class='entree'>"+
                  "<div class='avatar'>"+
                    "<img src='"+URL_ENT+entree[:owner][:avatar]+"' style='width: 100%;background-color: "+entree[:owner][:avatar_color]+"'>"  +       
                  "</div>"+
                  "<div class='message' style='background-color: "+entree[:owner][:back_color]+"' >"+
                    "<div class='message-info'>"+
                      "<div class='message-info-profil'>"+
                        "<span style='vertica' ><strong>"+entree[:owner][:infos]+"</strong></span>"   +              
                      "</div>"+
                      "<div class='message-info-date'>"+
                        "<span>"+date+"</span> "+           
                      "</div>"+
                    "</div>"+
                    "<div ta-bind class='message-text'>"+entree[:contenu]+"</div>"+
                  "</div>"+
                "</div>"
    end
    saisies
  end
end