import nodemailer from 'nodemailer';

export default class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user?.name?.split(' ')[0];
    this.url = url;
    this.from = `Harshit Rathour <${process.env.EMAIL_FROM}>`;
  }

  // Create transporter
  transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // If false, use TLS, otherwise SSL
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // Send email method
  async send(subject) {
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      text: `Hello ${this.firstName},\n\nPlease use the following link to reset your password: ${this.url}\n\nThe link is valid for 10 minutes.`,
    };

    // Send the email
    await this.transporter.sendMail(mailOptions);
  }

  // Password reset email method
  async sendPasswordReset() {
    const subject = 'Your password reset token (valid for only 10 minutes)';
    await this.send(subject);
  }
}
