# coding: utf-8
require 'htmlentities'
require 'date'

module HtmlMessageGenerator
  def self.generateHtmlCover(nom, prenom, sexe, classe, avatar, college)
    page = ''
    avatar = 'api/default_avatar/avatar_neutre.svg'
    avatar = 'api/default_avatar/avatar_feminin.svg' if sexe == 'F'
    avatar = 'api/default_avatar/avatar_masculin.svg' if sexe == 'M'
    avatar = "<img src='" + URL_ENT + avatar + "' style='text-align: center; width:400px; height:400px; background-color:rgba(128,186,102,0.7)'/>"
    info = "<div class='eleve-info'><div><span>" + prenom + ' ' + nom + '</span></div><div><span>' + classe + '</span></div><div><span>' + college + '</span></div></div>'
    titre = "<h1 class='titre'>Suivi de l'année scolaire " + Outils.annee_scolaire_string + '</h1>'

    page = avatar + info + titre
    html = HTMLEntities.new.decode page
    document = Nokogiri::HTML(html)
    document
  end

  def self.generateHtmlOnglet(onglet)
    page = ''
    onglet_html = '<h3>' + onglet[:nom] + '</h3><hr></hr>'
    messages_html = ''
    onglet[:entrees].each do |message|
      # p message.inspect
      messages_html += "<div class='message' style='background-color:" + message[:owner][:back_color] + "'>"
      messages_html += "  <div class='message-info'>"
      messages_html += "    <div class='message-info-profil'><span>" + message[:owner][:infos] + '</span></div>'
      messages_html += "    <div class='message-info-date'><span>" + message[:date].strftime('%d/%m/%Y - %kh%M') + '</span></div>'
      messages_html += '  </div>'
      messages_html += "  <div class='message-text'>" + message[:contenu] + '</div>'
      messages_html += '</div><br></br>'
    end
    page = onglet_html + messages_html + '<br></br>'
    html = HTMLEntities.new.decode page
    document = Nokogiri::HTML(html)
    document
  end

  def self.aside_public_carnet(user)
    # sexe_date = user["sexe"] == 'F' ? 'née le ' : 'né le '
    # date_naiss = Date.strptime(user['date_naissance'], "%Y-%m-%d").strftime("%d/%m/%Y")
    avatar = 'api/default_avatar/avatar_neutre.svg'
    avatar = 'api/default_avatar/avatar_feminin.svg' if user['sexe'] == 'F'
    avatar = 'api/default_avatar/avatar_masculin.svg' if user['sexe'] == 'M'
    avatar = URL_ENT + avatar
    aside =  "<div class='row carnet-eleve-contener'>"
    aside += "  <div class='col-xs-12 col-sm-12 col-md-12 col-lg-12' >"
    aside += "    <div class='row ' style='display: table-row'>"
    aside += "    <div class='col-xs-1 col-sm-1 col-md-5 col-lg-5 avatar-carnet'>"
    aside += "      <div class='rouge'>"
    aside += "        <img src='" + avatar + "'>"
    aside += '      </div>'
    aside += '    </div>'
    aside += "    <div class='col-xs-1 col-sm-1 col-md-7 col-lg-7 eleve-info'>"
    aside += "      <div class='eleve-info-firstname'>"
    aside += '        <span >' + user['prenom'] + '</span>'
    aside += '    </div>'
    aside += "    <div class='eleve-info-lastname'>"
    aside += '      <span >' + user['nom'].split('').first + '.' + '</span>'
    aside += '    </div>'
    aside += '    <div>'
    aside += '      <span>' + user['classes'][0]['etablissement_nom'] + '</span>'
    aside += '    </div>' +
             aside += '  </div>'
    aside += '</div>'
  end

  def self.main_public_carnet(onglets)
    tabs =  "<div class='row' style='height:100%'>\n"
    tabs += "<div class='col-xs-12 col-sm-12 col-md-12 col-lg-12' style='height:100%; padding:0'>\n"
    tabs += "<ul class='nav nav-tabs' role='class='active'tablist' id='myTab'>\n"
    contenu = "<div class='tab-content'>\n"
    onglets.each do |onglet|
      onglet[:ordre] == 1 ? active = 'active' : active = ''
      tabs += "<li role='presentation' class='" + active + "'><a href='#tab" + onglet[:id].to_s + "' aria-controls='tab' role='tab' data-toggle='tab'>" + onglet[:nom] + "</a></li>\n"
      contenu += "<div role='tabpanel' class='tab-pane " + active + "' id='tab" + onglet[:id].to_s + "'>" + (HtmlMessageGenerator.main_entrees_public_carnet onglet[:entrees]) + "</div>\n"
    end

    tabs += "</ul>\n" + contenu + "</div>\n"
    tabs += "</div>\n"
    tabs += "</div>\n"
    tabs += "<script src='<%= APP_PATH %>/app/bower_components/jquery/dist/jquery.js'></script>\n"
    tabs += "<script src='<%= APP_PATH %>/app/bower_components/bootstrap/dist/js/bootstrap.min.js'></script>\n"
  end

  def self.main_entrees_public_carnet(entrees)
    saisies = ''
    entrees.each do |entree|
      infos = entree[:owner][:infos].split(' ')
      infos[1] = infos[1].split('').first.upcase
      infos = infos.join(' ')
      date = entree[:date].strftime('%A %-d %B %Y - %k:%M')
      saisies += "<div class='entree'>"
      saisies += "<div class='avatar'>"
      saisies += "<img src='" + URL_ENT + 'api/default_avatar/avatar_neutre.svg' + "' style='width: 100%;background-color: " + entree[:owner][:avatar_color] + "'>"
      saisies += '</div>'
      saisies += "<div class='message' style='background-color: " + entree[:owner][:back_color] + "' >"
      saisies += "<div class='message-info'>"
      saisies += "<div class='message-info-profil'>"
      saisies += "<span style='vertica' ><strong>" + infos + '</strong></span>'
      saisies += '</div>'
      saisies += "<div class='message-info-date'>"
      saisies += '<span>' + date + '</span> '
      saisies += '</div>'
      saisies += '</div>'
      saisies += "<div ta-bind class='message-text'>" + entree[:contenu] + '</div>'
      saisies += '</div>'
      saisies += '</div>'
    end
    saisies
  end
end
