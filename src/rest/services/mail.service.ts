import { createTransport } from 'nodemailer'
import config from '../config/nodemailer.config'

const transporter = createTransport(config)

const sendResetMail = (email: string, url: string): Promise<boolean> => {
    return new Promise((resolve) => {
        const mailOptions = {
            from: process.env.NODEMAILER_MAIL,
            to: email,
            subject: 'Restablecer contraseña',
            html: `<a href="${url}">Clica aqui para restablecer la contraseña</a>`,
        }
        try {
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('Error al enviar el correo:', error);
                    resolve(false)
                } else {
                    console.log('Correo enviado:', info.response);
                    resolve(true)
                }
            })
        } catch (error) {
            console.error('Error al enviar el correo:', error);
            resolve(false)
        }
    })
}

export { sendResetMail }