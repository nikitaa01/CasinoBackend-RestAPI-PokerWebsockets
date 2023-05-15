"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = {
    host: 'smtp.office365.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.NODEMAILER_MAIL,
        pass: process.env.NODEMAILER_PASSWD,
    },
};
exports.default = config;
