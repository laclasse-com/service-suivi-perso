# coding: utf-8
require 'htmlentities'

# génération du carnet en pdf
module PdfGenerator
  def self.generate_pdf(nom, prenom, sexe, classe, avatar, college, onglets)
    final_doc = ''
    couverture = HtmlMessageGenerator.generate_cover nom, prenom, sexe, classe, avatar, college
    final_doc = couverture.to_html
    onglets.each do |onglet|
      document = HtmlMessageGenerator.generate_onglet onglet
      final_doc = final_doc + document.to_html + '<br></br>'
    end
    final_doc
  end
end
