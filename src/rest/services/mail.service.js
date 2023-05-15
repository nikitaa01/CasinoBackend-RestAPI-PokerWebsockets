"use strict";
exports.__esModule = true;
exports.sendResetMail = void 0;
var nodemailer_1 = require("nodemailer");
var nodemailer_config_1 = require("../config/nodemailer.config");
var transporter = (0, nodemailer_1.createTransport)(nodemailer_config_1["default"]);
var sendResetMail = function (email, url) {
    return new Promise(function (resolve) {
        var mailOptions = {
            from: process.env.NODEMAILER_MAIL,
            to: email,
            subject: 'Restablecer contraseña',
            html: "<a href=\"".concat(url, "\">Clica aqui para restablecer la contrase\u00F1a</a>")
        };
        try {
            transporter.sendMail(mailOptions, function (error, info) {
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
