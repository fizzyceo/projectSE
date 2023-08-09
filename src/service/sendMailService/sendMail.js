const nodemailer = require('nodemailer');
const ApiError = require("../../error/api-error");

const dotenv = require('dotenv');
dotenv.config();

class MailService {

  static transport = nodemailer.createTransport({
    service: process.env.SERVICE,

    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASSWORD,
    },
    port: 465,
    // host: "smtp.gmail.com",
    host: "mail.mycompound.net",

  });

  static async sendMail(userMail, message, subject, files) {
    try {
      let mailOptions = {
        from: `My compound<${process.env.MAIL_USER}>`,
        to: userMail,
        ...(files && {
          attachments: files.map((file) => {
            return {
              filename: file.originalname,
              content: file.buffer.data
            }
          })
        })
      }
      if (subject == "create-systemUser") {
        mailOptions = {
          ...mailOptions,
          subject: "my-compound",
          html: mailTemplate({
            title: "Welcome abroad",
            message,
            description: "Use this password to login and reset your password"

          })
        };
      }

      if (subject == "create-tenant") {
        mailOptions = {
          ...mailOptions,
          subject: "my-compound",
          html: mailTemplate({
            title: "welcome to my compound",
            message,
            description: "Use this password to login and reset your password"
          })
        };
      }

      if (subject == "OTP") {
        mailOptions = {
          ...mailOptions,
          subject: "my-compound",
          html: mailTemplate({
            title: "ًForget password code",
            message,
            description: "Use this OTP to verify your email"
          })
        };
      }

      let res = await MailService.transport.sendMail(mailOptions);
      if (res.accepted.length > 0) {
        return true;
      }
      return false;
    } catch (error) {
      throw ApiError.internal(error.message);
    }
  };

  static async sendMailsBetweenUsers(fromUser, message, subject) { }
  
}

module.exports = MailService;



function mailTemplate({
  title,
  message,
  description
}) {

  return`<html>
          <head>
            <style>
              body {
                font-family: Arial, sans-serif;
              }
              
              .otp {
                border: 10px solid orange;
                padding: 20px;
                text-align: center;
                font-size: 20px;
              }

              .container {
                max-width: 600px;
                margin: 0 auto;
                text-align: center;
                border: 20px solid orange;
              }
              img {
                width: 300px;
                margin-top:30px;
              }
            </style>
          </head>
          <body>
            <div class="container otp">
              <!-- Add your logo image here -->
              <img src="http://192.162.71.201:4052/images%2Frandom%2Fnormal%2F1680523947513-compoundLogo3.png" alt="Logo">
              <h1 style=" font-family: 'Times New Roman', Times, serif;">Welcome</h1>
              <p> ${title}</p>
              <p> ${description}</p>
              <p>${message}</p>
            </div>
            <span style="opacity: 0"> timestamp: ${Date.now()} </span>
          </body>
        </html>
              `
}