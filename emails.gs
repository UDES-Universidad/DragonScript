function _sendMail(email, subject, body) {
  MailApp.sendEmail({
    to: email,
    subject: subject,
    htmlBody: body
  });
}
