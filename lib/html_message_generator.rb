# coding: utf-8
require 'htmlentities'
require 'date'

# Helpers pour les messages HTML
module HtmlMessageGenerator
  def img_avatar(sexe = nil)
    case sexe
    when 'M' then return 'api/default_avatar/avatar_masculin.svg'
    when 'F' then return 'api/default_avatar/avatar_feminin.svg'
    else return 'api/default_avatar/avatar_neutre.svg'
    end
  end

  def self.generate_cover(nom, prenom, sexe, classe, avatar, college)
    avatar = "<img src='" + URL_ENT + img_avatar(sexe) + "' style='text-align: center; width:400px; height:400px; background-color:rgba(128,186,102,0.7)'/>"
    info = "<div class='eleve-info'><div><span>" + prenom + ' ' + nom + '</span></div><div><span>' + classe + '</span></div><div><span>' + college + '</span></div></div>'
    titre = "<h1 class='titre'>Suivi de l'année scolaire " + Outils.annee_scolaire_string + '</h1>'

    page = avatar + info + titre
    html = HTMLEntities.new.decode page
    document = Nokogiri::HTML(html)
    document
  end

  def self.generate_onglet(onglet)
    onglet_html = '<h3>' + onglet[:nom] + '</h3><hr></hr>'
    messages_html = ''
    onglet[:entrees].each do |message|
      messages_html += "<div class='message' style='background-color:" + message[:owner][:back_color] + "'>
        <div class='message-info'>
          <div class='message-info-profil'><span>" + message[:owner][:infos] + "</span></div>
          <div class='message-info-date'><span>" + message[:date].strftime('%d/%m/%Y - %kh%M') + "</span></div>
        </div>
        <div class='message-text'>" + message[:contenu] + '</div>
        </div><br/></br/>'
    end
    page = onglet_html + messages_html + '<br></br>'
    html = HTMLEntities.new.decode page
    document = Nokogiri::HTML(html)
    document
  end

  def self.aside_public_carnet(user)
    avatar = URL_ENT + img_avatar( user['sexe'])
    "<div class='row carnet-eleve-contener'>
        <div class='col-xs-12 col-sm-12 col-md-12 col-lg-12' >
          <div class='row ' style='display: table-row'>
            <div class='col-xs-1 col-sm-1 col-md-5 col-lg-5 avatar-carnet'>
              <div class='rouge'>
                <img src='" + avatar + "'>
              </div>
            </div>
          <div class='col-xs-1 col-sm-1 col-md-7 col-lg-7 eleve-info'>
            <div class='eleve-info-firstname'>
              <span >" + user['prenom'] + "</span>
          </div>
          <div class='eleve-info-lastname'>
            <span >" + user['nom'].split('').first + '.' + "</span>
          </div>
          <div>
            <span>" + user['classes'][0]['etablissement_nom'] + "</span>
          </div>
        </div>
      </div>"
  end

  def self.main_public_carnet(onglets)
    tabs =  "<div class='row' style='height:100%'>
      <div class='col-xs-12 col-sm-12 col-md-12 col-lg-12' style='height:100%; padding:0'>
      <ul class='nav nav-tabs' role='class='active'tablist' id='myTab'>\n"
    contenu = "<div class='tab-content'>\n"
    onglets.each do |onglet|
      onglet[:ordre] == 1 ? active = 'active' : active = ''
      tabs += "<li role='presentation' class='" + active + "'><a href='#tab" + onglet[:id].to_s + "' aria-controls='tab' role='tab' data-toggle='tab'>" + onglet[:nom] + "</a></li>\n"
      contenu += "<div role='tabpanel' class='tab-pane " + active + "' id='tab" + onglet[:id].to_s + "'>" + (HtmlMessageGenerator.main_entrees_public_carnet onglet[:entrees]) + "</div>\n"
    end

    tabs += "</ul>\n" + contenu + "</div>
      </div>
    </div>
    <script src='<%= APP_PATH %>/app/bower_components/jquery/dist/jquery.js'></script>
    <script src='<%= APP_PATH %>/app/bower_components/bootstrap/dist/js/bootstrap.min.js'></script>\n"
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
      saisies += "<img src='" + URL_ENT + img_avatar('N') + "' style='width: 100%;background-color: " + entree[:owner][:avatar_color] + "'>"
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
