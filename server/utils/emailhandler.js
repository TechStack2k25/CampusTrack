// import nodemailer from 'nodemailer';
import sgMail from '@sendgrid/mail';
import ApiError from './apierror.js';

export default class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user?.name?.split(' ')[0];
    this.url = url;
    this.from = process.env.SENDGRID_EMAIL_FROM;
    this.user_email = user.email;

    sgMail.setApiKey(process.env.SENDGRID_APIKEY);
  }
  // Send email method
  async send(subject, htmlbody, url, attachment = null) {
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      text: url,
      html: htmlbody,
    };
    try {
      await sgMail.send(mailOptions);
    } catch (error) {
      return next(new ApiError('Error in sending mail Try again', 409));
    }
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

  // // Send the email
  // await this.transporter.sendMail(mailOptions);

  // Password reset email method
  async sendPasswordReset() {
    const subject = 'Your password reset token (valid for only 10 minutes)';
    const htmlbody = `<p>Hello <strong>${this.firstName || 'User'}</strong>,</p>
             <p>Please use the following link to reset your password:</p>
             <a href="${this.url}">${this.url}</a>
             <p>The link is valid for 10 minutes.</p>`;
    const url = `Hello ${this.firstName},\n\nPlease use the following link to reset your password: ${this.url}\n\nThe link is valid for 10 minutes.`;
    await this.send(subject, htmlbody, url);
  }

  async sendEmailToken() {
    const subject = 'Your Email verification token (valid for only 10 minutes)';
    const htmlbody = `<p>Hello <strong>${this.firstName || 'User'}</strong>,</p>
             <p>Please use the following link to verify  your email:</p>
             <a href="${this.url}">${this.url}</a>
             <p>The link is valid for 10 minutes.</p>`;
    const url = `Hello ${this.firstName},\n\nPlease use the following link to verify  your email: ${this.url}\n\nThe link is valid for 10 minutes.`;
    await this.send(subject, htmlbody, url);
  }

  async sendEmailonverification() {
    const subject = 'Your College is verified';
    const htmlbody = `<p>Hello <strong>${this.firstName || 'User'}</strong>,</p>
             <p>Please use the following link to update your college or login your account to update it:</p>
             <a href="${this.url}">${this.url}</a>`;
    const url = `Hello ${this.firstName},\n\nPlease use the following link to update you college or login your account to update it: ${this.url}\n\n.`;
    await this.send(subject, htmlbody, url);
  }

  async sendEmailForDeleteCollege() {
    const subject =
      'Your Email verification for delete college (valid for only 10 minutes)';
    const htmlbody = `<p>Hello <strong>${this.firstName || 'Admin'}</strong>,</p>
             <p>Please use the following link to delete your college account:</p>
             <a href="${this.url}">${this.url}</a>
             <p>Warning Once you delete You lose all data </p>
             <p>The link is valid for 10 minutes.</p>`;
    const url = `Hello ${this.firstName},\n\n>Please use the following link to delete your college account:: ${this.url}\n\nWarning Once you delete You lose all data \n\nThe link is valid for 10 minutes.`;
    await this.send(subject, htmlbody, url);
  }

  async sendPassword() {
    const subject =
      'Your Password for current account';
    const htmlbody = `
             <p>Please use ${this.url} as current password to change your password.</p>`;
    const url = `Please use the ${this.url} as current password to change your password`;
    await this.send(subject, htmlbody, url);
  }
}
