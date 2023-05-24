"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendResetMail = void 0;
const nodemailer_1 = require("nodemailer");
const nodemailer_config_1 = __importDefault(require("../config/nodemailer.config"));
const transporter = (0, nodemailer_1.createTransport)(nodemailer_config_1.default);
const sendResetMail = (email, url) => {
    return new Promise((resolve) => {
        const mailOptions = {
            from: process.env.NODEMAILER_MAIL,
            to: email,
            subject: 'Restablecer contraseña',
            html: `<a href="${url}">Clica aqui para restablecer la contraseña</a>`,
        };
        try {
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('Error al enviar el correo:', error);
                    resolve(false);
                }
                else {
                    console.log('Correo enviado:', info.response);
                    resolve(true);
                }
            });
        }
        catch (error) {
            console.error('Error al enviar el correo:', error);
            resolve(false);
        }
    });
};
exports.sendResetMail = sendResetMail;
