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
  async send(subject, htmlbody, url, attachment = null) {
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      text: url,
      html: htmlbody,

      // if(attachment) {
      //   const pdfBuffer = fs.readFileSync(attachment.path);
      //   mailOptions.attachments = [
      //     {
      //       content: pdfBuffer.toString('base64'),
      //       filename: attachment.filename,
      //       type: 'application/pdf',
      //       disposition: 'attachment',
      //     },
      //   ];
      // },
    };
    // // Send the email
    // await this.transporter.sendMail(mailOptions);
    try {
      await sgMail.send(mailOptions);
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

  // async sendCollegecCredentials(attachment) {
  //   this.to = process.env.SENDGRID_EMAIL_FROM;
  //   this.from = this.user_email;
  //   const subject = 'To verify the college Credentials';
  //   const htmlbody = `<p>Hello</p>
  //            <p>Please verify the credetials of College</p>
  //            <a href="${this.url}">${this.url}</a>
  //            <p>There is A attachment for the credentials of college</p>`;
  //   const url = `Hello ,\n\nPlease use the following link to verify  college Credentials: ${this.url}\n\n.<p>There is a attachment for the credentials of college</p>`;
  //   await this.send(subject, htmlbody, url, attachment);
  // }
  async sendEmailonverification() {
    const subject = 'Your College is verified';
    const htmlbody = `<p>Hello <strong>${this.firstName}</strong>,</p>
             <p>Please use the following link to update you college:</p>
             <a href="${this.url}">${this.url}</a>`;
    const url = `Hello ${this.firstName},\n\nPlease use the following link to update you college: ${this.url}\n\n.`;
    await this.send(subject, htmlbody, url);
  }

  async sendEmailForDeleteCollege() {
    const subject =
      'Your Email verification for delete college (valid for only 10 minutes)';
    const htmlbody = `<p>Hello <strong>${this.firstName}</strong>,</p>
             <p>Please use the following link to delete your college account:</p>
             <a href="${this.url}">${this.url}</a>
             <p>Warning Once you delete You lose all data </p>
             <p>The link is valid for 10 minutes.</p>`;
    const url = `Hello ${this.firstName},\n\n>Please use the following link to delete your college account:: ${this.url}\n\nWarning Once you delete You lose all data \n\nThe link is valid for 10 minutes.`;
    await this.send(subject, htmlbody, url);
  }
}
