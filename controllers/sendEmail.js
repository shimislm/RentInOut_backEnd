const { config } = require("../config/config");
const nodemailer = require("nodemailer");
// const { mailOptions } = require("../helpers/userHelper");

let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: config.gmailUser,
        pass: config.gmailPass
    }
});

let mailOptions = (_email , _subject , _html) => {
    const mailOptions = {
      from: _email,
      to: _email,
      subject: _subject,
      html: _html
    };
}
exports.mailMe = {
    sendEmail: async (req, res) => {
        let subject = "mail send from " + req.body.phone;
        let htmlMessage = `<div color:danger> <h2>${req.body.firstName} - ${req.body.lastName}</h2> <span>${req.body.phone}</span> | <span>${req.body.email}</span> <p>${req.body.textarea}</p> </div>`
        const email = mailOptions("ido12301f@gmail.com", subject, htmlMessage)
        try {
            transporter.sendMail(email, (err, info) => {
                res.json({
                    status: "send",
                    message: "The message sent successfully"
                })
                return
            })
        }
        catch (err) {
            return res.json({ err: "There was a problem" })
        }
    }
}






