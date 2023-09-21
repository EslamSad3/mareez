const nodemailer = require('nodemailer');
const sendEmail = async(options) => {
  // 1- create transporter (service will send email like gmail,sendGrid)
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT, // if secure is false port = 578, if true port = 465
    secure: true,
    auth: {
      user: process.env.EMAIL_AUTH_USER,
      pass: process.env.EMAIL_AUTH_PASSWORD,
    },
  });
  // 2- Define email options (from,to,subject,message)
  const mailOptions = {
    from: `Mareez-sa.com <${process.env.EMAIL_AUTH_USER}>`,
    to:options.email,
    subject:options.subject,
    text:options.message,
  };
  // 3- send email
  await transporter.sendMail(mailOptions)
};
module.exports = sendEmail;
