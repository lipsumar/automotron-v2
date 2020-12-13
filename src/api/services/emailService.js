const mailgun = require('mailgun-js');

const mg = mailgun({
  apiKey: process.env.MAILGUN_API_KEY,
  domain: process.env.MAILGUN_DOMAIN,
  host: process.env.MAILGUN_HOST,
});

module.exports = {
  sendTemplate(toEmail, subject, template, variables) {
    const data = {
      from: 'Automotron.io <no-reply@automotron.io>',
      to: toEmail,
      subject,
      template,
      'h:X-Mailgun-Variables': JSON.stringify(variables),
    };
    return new Promise((resolve, reject) => {
      mg.messages().send(data, (err, body) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(body);
      });
    });
  },
};
