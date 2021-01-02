/* eslint-disable prettier/prettier */
var smtpConfig = {
  Mandrill: {
    host: 'smtp.sendgrid.net',
    port: 465,
    auth: {
      user: 'apikey',
      pass:
        'passkey'
    },
    senderEmail: 'support@yourdomain.com'
  }
}
module.exports = {
  smtpConfig: smtpConfig
}
