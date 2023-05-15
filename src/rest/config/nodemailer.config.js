"use strict";
exports.__esModule = true;
var config = {
    host: 'smtp.office365.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.NODEMAILER_MAIL,
        pass: process.env.NODEMAILER_PASSWD
    }
};
exports["default"] = config;
