// import nodemailer from 'nodemailer';
import sgMail from '@sendgrid/mail';
import ApiError from './apierror.js';

export default class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user?.name?.split(' ')[0];
    this.url = url;
    this.from = process.env.SENDGRID_EMAIL_FROM;
    // Set the SendGrid API key once in the constructor
    console.log(process.env.SENDGRID_APIKEY);
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
  async send(subject, htmlbody, url) {
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      text: url,
      html: htmlbody,
    };
    // // Send the email
    // await this.transporter.sendMail(mailOptions);
    try {
      await sgMail.send(mailOptions);
      console.log('✅ Email sent successfully');
    } catch (error) {
      return next(new ApiError('Error in sending mail Try again', 409));
    }
  }

  // Password reset email method
  async sendPasswordReset() {
    const subject = 'Your password reset token (valid for only 10 minutes)';
    const htmlbody = `<p>Hello <strong>${this.firstName}</strong>,</p>
             <p>Please use the following link to reset your password:</p>
             <a href="${this.url}">${this.url}</a>
             <p>The link is valid for 10 minutes.</p>`;
    const url = `Hello ${this.firstName},\n\nPlease use the following link to reset your password: ${this.url}\n\nThe link is valid for 10 minutes.`;
    await this.send(subject, htmlbody, url);
  }

  async sendEmailToken() {
    const subject = 'Your Email verification token (valid for only 10 minutes)';
    const htmlbody = `<p>Hello <strong>${this.firstName}</strong>,</p>
             <p>Please use the following link to verify  your email:</p>
             <a href="${this.url}">${this.url}</a>
             <p>The link is valid for 10 minutes.</p>`;
    const url = `Hello ${this.firstName},\n\nPlease use the following link to verify  your email: ${this.url}\n\nThe link is valid for 10 minutes.`;
    await this.send(subject, htmlbody, url);
  }
}
