#coding: utf-8
require 'mail'

module MailGenerator

  Mail.defaults do
    #delivery_method :smtp, address: "localhost", port: 25, openssl_verify_mode => OpenSSL::SSL::VERIFY_NONE
    delivery_method :test
  end

	def MailGenerator.send_email expediteur, destinataire, objet, message, file
    begin
      mail = Mail.new do
        from expediteur
        to destinataire
        subject objet
        body message
        add_file :filename => file[:name], :content => File.read(file[:path]) if !file.nil?
      end
      mail.deliver
    rescue Exception => e
      p e.message.inspect
      p e.backtrace[0..10].inspect
      raise "Impossible d'envoyer l'email"
    end
	end

  def MailGenerator.send_emails uid_expediteur, destinataires, objet, message, file
    results = {envoye: [], echoue: []}
    email_exp = uid_expediteur + MAIL_DOMAINE
    Mail::TestMailer.deliveries.clear
    destinataires.each do |destinataire|
      email_dest = destinataire["uid"] + MAIL_DOMAINE
      begin
        send_email(email_exp, email_dest, objet, message, file)
        results[:envoye].push({name: destinataire["fullname"], message: "Message envoyé"})
      rescue Exception => e
        results[:echoue].push({name: destinataire["fullname"], message: "Impossible d'envoyer le message"})
      end
    end
    # test .
    puts Mail::TestMailer.deliveries.first
    puts "#{Mail::TestMailer.deliveries.length} emails sent to toto"
    results
  end
end