import { SmtpClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts"
import { renderFileToString, Params } from "https://deno.land/x/dejs/mod.ts";
import { env } from "../helpers/config.ts"

export default class MailService {
    private client: SmtpClient = new SmtpClient()

    private async connect() {
        await this.client.connectTLS({
            hostname: env.SMTP_HOSTNAME!,
            port: parseInt(env.SMTP_PORT!)!,
            username: env.SMTP_USERNAME!,
            password: env.SMTP_PASSWORD!
        })
    }

    private async close() {
        await this.client.close()
    }

    async send(to: string, subject: string, template: 'delete-account' | 'reset-account-pwd', data: Params) {
        await this.connect()

        await this.client.send({
            from: env.SMTP_MAIL!,
            to: env.DENO_ENV === 'prod' ? to : env.SMTP_MAIL!,
            subject: `${subject} - ${env.APP_NAME}`,
            content: '',
            html: await renderFileToString(
                `${Deno.cwd()}/templates/${template}.mail.ejs`,
                {
                    subject: `${subject} - ${env.APP_NAME}`,
                    appName: env.APP_NAME,
                    year: new Date().getFullYear(),
                    ...data
                }
            )
        })

        await this.close()
    }
}