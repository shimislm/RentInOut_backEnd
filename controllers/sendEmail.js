const { config } = require("../config/config");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: config.gmailUser,
    pass: config.gmailPass
  }
});

const emailConfig = (_email, _subject, _html) => {
  return {
    from: config.gmailUser,
    to: config.gmailUser,
    subject: _subject,
    html: _html
  };
};

exports.emailCtrl = {
  sendEmail: async (req, res) => {
    let subject = "mail send from " + req.body.phone;
    let htmlMessage = `<div color:danger> <h2>${req.body.firstName} - ${req.body.lastName}</h2> 
    <span>${req.body.phone}</span> | <span>${req.body.email}</span> <p>${req.body.textarea}</p> </div>`;
    const email = emailConfig(req.body.email, subject, htmlMessage);
    try {
      transporter.sendMail(email, (err, info) => {
        return void res.json({
          status: "send",
          message: "The message sent successfully"
        });
      });
    }
    catch (err) {
      return res.json({ err: "There was a problem" });
    }
  }
}






