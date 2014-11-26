#coding: utf-8
require 'htmlentities'

module PdfGenerator

	def PdfGenerator.generate_pdf nom, prenom, sexe, classe, avatar, collège, onglets
		final_doc = ""
		couverture = HtmlMessageGenerator.generateHtmlCover nom, prenom, sexe, classe, avatar, collège
		final_doc = couverture.to_html
		onglets.each do |onglet|
			document = HtmlMessageGenerator.generateHtmlOnglet onglet
			final_doc = final_doc + document.to_html+'<br></br>'
		end
		final_doc
	end
end