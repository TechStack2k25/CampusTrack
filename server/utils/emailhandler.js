// import nodemailer from 'nodemailer';
import sgMail from '@sendgrid/mail';

export default class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user?.name?.split(' ')[0];
    this.url = url;
    this.from = process.env.SENDGRID_EMAIL_FROM;
    // Set the SendGrid API key once in the constructor
    sgMail.setApiKey(process.env.SENDGRID_APIKEY);
  }
  // Create transporter
  // transporter = nodemailer.createTransport({
  //   host: process.env.EMAIL_HOST,
  //   port: process.env.EMAIL_PORT,
  //   secure: false, // If false, use TLS, otherwise SSL
  //   auth: {
  //     user: process.env.EMAIL_USER,
  //     pass: process.env.EMAIL_PASSWORD,
  //   },
  // });

  // Send email method
  async send(subject) {
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      text: `Hello ${this.firstName},\n\nPlease use the following link to reset your password: ${this.url}\n\nThe link is valid for 10 minutes.`,
      html: `<p>Hello <strong>${this.firstName}</strong>,</p>
             <p>Please use the following link to reset your password:</p>
             <a href="${this.url}">${this.url}</a>
             <p>The link is valid for 10 minutes.</p>`,
    };
    // // Send the email
    // await this.transporter.sendMail(mailOptions);
    try {
      await sgMail.send(mailOptions);
      console.log('✅ Email sent successfully');
    } catch (error) {
      console.error(
        '❌ Error sending email:',
        error.response?.body || error.message
      );
    }
  }

  // Password reset email method
  async sendPasswordReset() {
    const subject = 'Your password reset token (valid for only 10 minutes)';
    await this.send(subject);
  }
}
