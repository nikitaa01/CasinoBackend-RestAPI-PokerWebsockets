import { createTransport } from 'nodemailer'
import config from '../config/nodemailer.config'

const transporter = createTransport(config)

const sendResetMail = (email: string, url: string) => {
    const mailOptions = {
        from: process.env.NODEMAILER_MAIL,
        to: email,
        subject: 'Restablecer contraseña',
        html: `<a href="${url}">Clica aqui para restablecer la contraseña</a>`,
    }
    console.log(config)
    let success = false
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error al enviar el correo:', error);
            
        } else {
            console.log('Correo enviado:', info.response);
            success = true
        }
    })
    return success
}

export { sendResetMail }