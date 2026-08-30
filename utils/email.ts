import { User } from "../generated/prisma/client";

import nodemailer, { SendMailOptions } from "nodemailer";
interface IEmail {
  user: User;
  url: string;
}
type SendEmail = {
  template: string;
  subject: string;
};
class Email {
  email: string;
  name: string;
  url: string;
  from: string;
  constructor({ user, url }: IEmail) {
    this.email = user.email;
    this.name = `${user.firstName} ${user.lastName}`;
    this.url = url;
    this.from = `${process.env.EMAIL_FROM}`;
  }
  newTransport() {
    return nodemailer.createTransport({
      host: "smtp.resend.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.RESEND_USER,
        pass: process.env.RESEND_PASSWORD,
      },
    });
  }
  async sendEmail({ template, subject }: SendEmail) {
    const mailOptions: SendMailOptions = {
      to: this.email,
      from: this.from,
      html: template,
      subject,
    };
    await this.newTransport().sendMail(mailOptions);
  }
}
export default Email;
