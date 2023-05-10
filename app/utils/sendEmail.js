const nodeMailer = require("nodemailer");
const fs = require("fs");
const path = require("path");

class Mail {
  constructor(email) {
    this.email = email;
  }
  html_template() {}
  async sendEmail(mailOptions) {
    const transporter = nodeMailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      service: process.env.MAIL_SERVICE,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
      },
    });
    await transporter.sendMail(mailOptions);
  }
}

class VerificationMail extends Mail {
  constructor(email, verificationUrl, template) {
    super(email);
    this.subject = "Email Verification";
    this.data =
      "Thanks for starting the new account creation process. \
    We want to make sure it's really you. Please click the button below \
    to verify your email address. If you do not want to create an account, \
    you can ignore this message.";
    this.template = template;
    this.verificationUrl = verificationUrl;
  }

  html_template(template) {
    return template
      .replace("{{subject}}", this.subject)
      .replace("{{data}}", this.data)
      .replace("{{verificationUrl}}", this.verificationUrl)
      .replace("{{email}}", this.email);
  }

  async sendEmail() {
    const email_template_path = path.join(
      process.cwd(),
      "app",
      `views/${this.template}`,
    );
    const template = fs.readFileSync(email_template_path, "utf-8");
    const html = this.html_template(template);
    const mailOptions = {
      from: { name: "Clinic Management", address: process.env.MAIL_USER },
      to: this.email,
      subject: this.subject,
      html: html,
    };
    super.sendEmail(mailOptions);
  }
}

class AppointmentMail extends Mail {
  constructor(email, template, info) {
    super(email);
    this.subject = "Remind Email";
    this.template = template;
    this.info = info;
  }

  html_template(template) {
    return template
      .replace("{{Subject}}", this.subject)
      .replace("{{PatientName}}", this.info.user_name)
      .replace("{{DoctorName}}", this.info.doctor_name)
      .replace("{{AppointmentDate}}", this.info.appointment_date.date)
      .replace("{{AppointmentTime}}", this.info.appointment_date.startTime);
  }

  async sendEmail() {
    const email_template_path = path.join(
      process.cwd(),
      "app",
      `views/${this.template}`,
    );
    const template = fs.readFileSync(email_template_path, "utf-8");
    const html = this.html_template(template);
    const mailOptions = {
      from: { name: "Clinic Management", address: process.env.MAIL_USER },
      to: this.email,
      subject: this.subject,
      html: html,
    };
    super.sendEmail(mailOptions);
  }
}

class AppointmentPayment extends Mail {
  constructor(email, template, info, link) {
    super(email);
    this.subject = "Payment Reminder";
    this.template = template;
    this.info = info;
    this.link = link;
  }

  html_template(template) {
    return template
      .replace("[Patient Name]", this.info?.patient_name)
      .replace("[Date]", this.info?.appointment_date)
      .replace("[Payment Link]", this.link);
  }

  async sendEmail() {
    const email_template_path = path.join(
      process.cwd(),
      "app",
      `views/${this.template}`,
    );
    const template = fs.readFileSync(email_template_path, "utf-8");
    const html = this.html_template(template);
    const mailOptions = {
      from: { name: "Clinic Management", address: process.env.MAIL_USER },
      to: this.email,
      subject: this.subject,
      html: html,
    };
    super.sendEmail(mailOptions);
  }
}

module.exports = {
  Mail,
  VerificationMail,
  AppointmentMail,
  AppointmentPayment,
};
