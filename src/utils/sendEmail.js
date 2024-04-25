import nodemailer from "nodemailer";
export const sendEmail = async (email, subject, message) => {
  return new Promise((resolve, reject) => {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.senderEmail,
        pass: process.env.emailPassword,
      },
    });
    var mailOptions = {
      from: `Al3alama ${process.env.senderEmail}`,
      to: email,
      subject,
      text: message,
      //html: "<b>Hello world?</b>", // html body
    };
    console.log(email);
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
};
