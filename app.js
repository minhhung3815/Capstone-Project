const nodeMailer = require('nodemailer');
const sgMail = require('@sendgrid/mail');
require('dotenv').config('config.env');
sgMail.setApiKey(
  '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',
);

const sendEmail = async options => {
  console.log(process.env.SENDGRID_API_KEY, process.env.SENDGRID_MAIL);
  const transporter = nodeMailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    service: 'gmail',
    auth: {
      user: 'nguyenhung041201@gmail.com',
      pass: 'byyaueggperlydwi',
    },
  });

  const mailOptions = {
    from: { name: 'Clinic Management', address: 'nguyenhung041201@gmail.com' },
    to: 'minhhungnguyen3815@gmail.com',
    subject: 'ALOO',
    html: 'JSFAHKJHSFAGJHFSAGFJASHGFASKJFAGSAFGH',
  };

  await transporter.sendMail(mailOptions);

  //   const msg = {
  //     to: 'minhhungnguyen3815@gmail.com',
  //     from: { name: 'Hung Nguyen', email: 'minhhungnguyen3815@gmail.com' },
  //     subject: 'Hello mtf',
  //     text: 'Hello Guy',
  //     html: '<h1>Heloooosadjkasopd</h1>',
  //     // templateId: options.templateId,
  //     // dynamic_template_data: options.data,
  //   };
  //   sgMail
  //     .send(msg)
  //     .then(() => {
  //       console.log('Email Sent');
  //     })
  //     .catch(error => {
  //       console.error(error);
  //     });
};

sendEmail('dsad');

module.exports = sendEmail;
