const nodeMailer = require("nodemailer");
const fs = require("fs");
const path = require("path");

const html_template = async (template, options) => {
  if (options.template === process.env.MAIL_VERIFICATION) {
    return template
      .replace("{{subject}}", options.subject)
      .replace("{{data}}", options.data)
      .replace("{{verificationUrl}}", options.verificationUrl)
      .replace("{{email}}", options.email);
  } else if (options.template === process.env.MAIL_PRESCRIPTION) {
  } else if (options.template === process.env.MAIL_FORGOT_PASSWORD) {
  } else if (options.template === process.env.MAIL_APPOINTMENT) {
  } else {
  }
};

const sendEmail = async options => {
  const email_template_path = path.join(
    __dirname,
    "..",
    `views/${options.template}`,
  );
  const transporter = nodeMailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    service: process.env.MAIL_SERVICE,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASSWORD,
    },
  });
  const template = fs.readFileSync(email_template_path, "utf-8");
  const html = await html_template(template, options);
  const mailOptions = {
    from: { name: "Clinic Management", address: process.env.MAIL_USER },
    to: options.email,
    subject: options.subject,
    html: html,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
