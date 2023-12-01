import { createTransport, Transporter } from "nodemailer";
import { getEnv } from "./helpers";

export default class MailService {
  private transporter: Transporter;

  constructor() {
    this.transporter = createTransport({
      // @ts-ignore
      host: getEnv("SMTP_HOST"),
      port: getEnv("SMTP_PORT"),
      secure: true,
      auth: {
        user: getEnv("SMTP_USER"),
        pass: getEnv("SMTP_PASS"),
      },
    });
  }

  async sendMail(
    to: string,
    subject: string,
    html: string,
    from: string = getEnv("SMTP_USER")
  ) {
    return await this.transporter.sendMail({
      from,
      to,
      subject,
      html,
    });
  }
}
