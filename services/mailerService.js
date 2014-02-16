var mailer = function (config) {

    var nodeMailer = require('nodemailer');

    var smtpTransport = nodeMailer.createTransport('SMTP', {
        service: 'Gmail',
        auth: {
            user: config.gmail.username,
            pass: config.gmail.password
        }
    });

    return {

        send: function (to, subject, text) {
            var mailOptions = {
                from: 'Smartass <dont-reply@gmail.com>',
                subject: '[Smartass] ' + subject,
                to: to,
                text: text
            }

            console.log('Sending mail: ' + subject);
            smtpTransport.sendMail(mailOptions, function (error, response) {
                if (error) {
                    console.log(error);
                } else {
                    console.log("Message sent: " + response.message);
                }

                smtpTransport.close(); // shut down the connection pool, no more messages
            });
        }

    }

};

module.exports = mailer;
