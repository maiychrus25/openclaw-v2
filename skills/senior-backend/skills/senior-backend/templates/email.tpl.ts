import nodemailer from 'nodemailer';
import pug from 'pug';
import { convert } from 'html-to-text';
import { logger } from '@/utils/logger';

/**
 * Lớp Email dùng để gửi email từ hệ thống (Welcome, Password Reset, etc.)
 * Sử dụng Pug để render HTML và html-to-text để tạo version plain text.
 * 
 * Cách dùng: 
 * await new Email(user, url).sendWelcome();
 */
export class Email {
  private to: string;
  private firstName: string;
  private url: string;
  private from: string;

  constructor(user: { email: string; name: string }, url: string) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM}>`;
  }

  private newTransport() {
    if (process.env.NODE_ENV === 'production') {
      // SendGrid hoặc SMTP service cho Production
      return nodemailer.createTransport({
        host: process.env.EMAIL_HOST_PROD,
        port: Number(process.env.EMAIL_PORT_PROD),
        auth: {
          user: process.env.EMAIL_USERNAME_PROD,
          pass: process.env.EMAIL_PASSWORD_PROD,
        },
      });
    }

    // Mailtrap hoặc SMPT service cho Development
    return nodemailer.createTransport({
      host: process.env.MAILTRAP_HOST,
      port: Number(process.env.MAILTRAP_PORT),
      auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS,
      },
    });
  }

  /**
   * Phương thức lõi để gửi email
   */
  async send(template: string, subject: string) {
    // 1) Render HTML dựa trên một pug template
    // File template nên được đặt tại src/views/emails/
    const html = pug.renderFile(`${__dirname}/../views/emails/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject,
    });

    // 2) Định nghĩa email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: convert(html, {
        wordwrap: 130,
      }),
    };

    // 3) Tạo transport và gửi email
    try {
      await this.newTransport().sendMail(mailOptions);
      logger.info(`[Email.send] Successfully sent email "${subject}" to ${this.to}`);
    } catch (error) {
      logger.error(`[Email.send] Error sending email "${subject}" to ${this.to}:`, error);
      throw error;
    }
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to the Family!');
  }

  async sendPasswordReset() {
    await this.send('passwordReset', 'Your password reset token (valid for only 10 minutes)');
  }
}
