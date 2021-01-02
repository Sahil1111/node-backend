'use strict'

const emailConfig = require('./emailConfig')
const nodeMailerModule = require('nodemailer')
const smtpTransport = require('nodemailer-smtp-transport')
const transporter = nodeMailerModule.createTransport(
  smtpTransport(emailConfig.smtpConfig.Mandrill)
)
const emailTemplates = require('./emailTemplates')
const Handlebars = require('handlebars')

module.exports = {
  async sendEmailToUser(
    emailType,
    emailVariables,
    emailId,
    emailFrom,
    emailSubject
  ) {
    var mailOptions = {
      from: emailFrom,
      to: emailId,
      subject: null,
      html: null
    }

    switch (emailType) {
      case 'FORGOT_PASSWORD':
        mailOptions.subject = emailSubject
        mailOptions.html = renderMessageFromTemplateAndVariables(
          emailTemplates.forgotPassword,
          emailVariables
        )
        sendMailViaTransporter(mailOptions)
        break
      case 'INDIVIDUAL_SIGNUP':
        mailOptions.subject = emailSubject
        mailOptions.html = renderMessageFromTemplateAndVariables(
          emailTemplates.signupMail,
          emailVariables
        )
        sendMailViaTransporter(mailOptions)
        break
      case 'REGISTRATION_ACKNOWLEDGE':
        mailOptions.subject = emailSubject
        mailOptions.html = renderMessageFromTemplateAndVariables(
          emailTemplates.newRegisterationAcknowledge,
          emailVariables
        )
        sendMailViaTransporter(mailOptions)
        break
      case 'REGISTRATION_WELCOME':
        mailOptions.subject = emailSubject
        mailOptions.html = renderMessageFromTemplateAndVariables(
          emailTemplates.newRegisterationAcknowledge,
          emailVariables
        )
        sendMailViaTransporter(mailOptions)
        break
      case 'NEW_MANAGER_ADDED':
        mailOptions.subject = emailSubject
        mailOptions.html = renderMessageFromTemplateAndVariables(
          emailTemplates.newManagerAdded,
          emailVariables
        )
        sendMailViaTransporter(mailOptions)
        break
      case 'CONFIGURABLE_MAIL':
        mailOptions.subject = emailSubject
        mailOptions.html = renderMessageFromTemplateAndVariables(
          emailTemplates.configurableMail,
          emailVariables
        )
        sendMailViaTransporter(mailOptions)
        break
      case 'CONFIGURABLE_MAIL2':
        mailOptions.subject = emailSubject
        mailOptions.html = renderMessageFromTemplateAndVariables(
          emailTemplates.configurableMail2,
          emailVariables
        )
        sendMailViaTransporter(mailOptions)
        break
      case 'CREATE_AGENT':
        mailOptions.subject = emailSubject
        mailOptions.html = renderMessageFromTemplateAndVariables(
          emailTemplates.createAgent,
          emailVariables
        )
        sendMailViaTransporter(mailOptions)
        break
      case 'CREATE_MANAGER':
        mailOptions.subject = emailSubject
        mailOptions.html = renderMessageFromTemplateAndVariables(
          emailTemplates.createManager,
          emailVariables
        )
        sendMailViaTransporter(mailOptions)
        break
      case 'RESET_PASSWORD':
        mailOptions.subject = emailSubject
        mailOptions.html = renderMessageFromTemplateAndVariables(
          emailTemplates.resetPassword,
          emailVariables
        )
        sendMailViaTransporter(mailOptions)
        break
      case 'ORDER':
        mailOptions.subject = renderMessageFromTemplateAndVariables(
          emailSubject.email_subject,
          emailVariables
        )
        var content = renderMessageFromTemplateAndVariables(
          emailSubject.content,
          emailVariables
        )
        emailVariables.heading = mailOptions.subject
        emailVariables.content = content
        mailOptions.html = renderMessageFromTemplateAndVariables(
          emailTemplates.configurableMailCustomer,
          emailVariables
        )
        sendMailViaTransporter(mailOptions)
        break
    }
  }
}

exports.sendEmailToUserAsync = function(
  emailType,
  emailVariables,
  emailId,
  emailFrom,
  emailSubject
) {
  var mailOptions = {
    from: emailFrom,
    to: emailId,
    subject: null,
    html: null
  }

  switch (emailType) {
    case 'FORGOT_PASSWORD':
      mailOptions.subject = emailSubject
      mailOptions.html = renderMessageFromTemplateAndVariables(
        emailTemplates.forgotPassword,
        emailVariables
      )
      sendMailViaTransporter(mailOptions)
      break
    case 'REGISTRATION_ACKNOWLEDGE':
      mailOptions.subject = emailSubject
      mailOptions.html = renderMessageFromTemplateAndVariables(
        emailTemplates.newRegisterationAcknowledge,
        emailVariables
      )
      sendMailViaTransporter(mailOptions)
      break
    case 'REGISTRATION_WELCOME':
      mailOptions.subject = emailSubject
      mailOptions.html = renderMessageFromTemplateAndVariables(
        emailTemplates.newRegisterationAcknowledge,
        emailVariables
      )
      sendMailViaTransporter(mailOptions)
      break
    case 'NEW_MANAGER_ADDED':
      mailOptions.subject = emailSubject
      mailOptions.html = renderMessageFromTemplateAndVariables(
        emailTemplates.newManagerAdded,
        emailVariables
      )
      sendMailViaTransporter(mailOptions)
      break
    case 'CONFIGURABLE_MAIL':
      mailOptions.subject = emailSubject
      mailOptions.html = renderMessageFromTemplateAndVariables(
        emailTemplates.configurableMail,
        emailVariables
      )
      sendMailViaTransporter(mailOptions)
      break
    case 'CONFIGURABLE_MAIL2':
      mailOptions.subject = emailSubject
      mailOptions.html = renderMessageFromTemplateAndVariables(
        emailTemplates.configurableMail2,
        emailVariables
      )
      sendMailViaTransporter(mailOptions)
      break
    case 'CREATE_AGENT':
      mailOptions.subject = emailSubject
      mailOptions.html = renderMessageFromTemplateAndVariables(
        emailTemplates.createAgent,
        emailVariables
      )
      sendMailViaTransporter(mailOptions)
      break
    case 'CREATE_MANAGER':
      mailOptions.subject = emailSubject
      mailOptions.html = renderMessageFromTemplateAndVariables(
        emailTemplates.createManager,
        emailVariables
      )
      sendMailViaTransporter(mailOptions)
      break
    case 'RESET_PASSWORD':
      mailOptions.subject = emailSubject
      mailOptions.html = renderMessageFromTemplateAndVariables(
        emailTemplates.resetPassword,
        emailVariables
      )
      sendMailViaTransporter(mailOptions)
      break
    case 'ORDER':
      mailOptions.subject = renderMessageFromTemplateAndVariables(
        emailSubject.email_subject,
        emailVariables
      )
      var content = renderMessageFromTemplateAndVariables(
        emailSubject.content,
        emailVariables
      )
      emailVariables.heading = mailOptions.subject
      emailVariables.content = content
      mailOptions.html = renderMessageFromTemplateAndVariables(
        emailTemplates.configurableMailCustomer,
        emailVariables
      )
      sendMailViaTransporter(mailOptions)
      break
  }
}

function renderMessageFromTemplateAndVariables(templateData, variablesData) {
  return Handlebars.compile(templateData)(variablesData)
}

function sendMailViaTransporter(mailOptions) {
  transporter.sendMail(mailOptions, function(_error, info) {
    console.log('Mail Sent Callback Info:', info)
  })
  return true
}
