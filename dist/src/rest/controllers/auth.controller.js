"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.confirmResetPassword = exports.sendResetPassword = exports.logout = exports.login = exports.register = exports.googleCallback = exports.redirectToGoogleAuth = void 0;
const auth_service_1 = require("../services/auth.service");
const users_service_1 = require("../services/users.service");
const jwt_1 = require("../utils/jwt");
const mail_service_1 = require("../services/mail.service");
const jwt_2 = require("../utils/jwt");
const redirectToGoogleAuth = (_req, res) => {
    res.redirect((0, auth_service_1.getGoogleAuthURL)());
};
exports.redirectToGoogleAuth = redirectToGoogleAuth;
const googleCallback = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const resToken = yield (0, auth_service_1.getGoogleToken)(req.query.code);
    if (!resToken.ok) {
        return res.status(400).redirect(`${process.env.ROOT_URI}/login`);
    }
    const token = resToken.data;
    const resProfile = yield (0, auth_service_1.getGoogleProfile)(token.access_token, token.id_token);
    if (!resProfile.ok) {
        return res.status(400).redirect(`${process.env.ROOT_URI}/login`);
    }
    const profile = resProfile.data;
    const resFindedUser = yield (0, users_service_1.getUserByOauth)(profile.id);
    if (!resFindedUser.ok) {
        const resCreatedUser = yield (0, users_service_1.create)({
            first_name: profile.given_name,
            last_name: profile.family_name,
            email: profile.email,
            password: profile.id,
            avatar_url: profile.picture,
            oauth_provider: "google",
            oauth_provider_id: profile.id,
        });
        if (!resCreatedUser.ok) {
            return res.status(400).redirect(`${process.env.ROOT_URI}/login`);
        }
        req.session.token = (0, jwt_1.generateToken)(resCreatedUser.data.id);
        return res.redirect(`${process.env.ROOT_URI}`);
    }
    req.session.token = (0, jwt_1.generateToken)(resFindedUser.data.id);
    return res.redirect(`${process.env.ROOT_URI}`);
});
exports.googleCallback = googleCallback;
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (req.body.role == 'ADMIN' && ((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) != 'ADMIN') {
        return res.status(403).send({ error: "Only admin users can create admin users" });
    }
    const resFindedUser = yield (0, users_service_1.getUserByEmail)(false, req.body.email);
    if (resFindedUser.ok) {
        return res.status(409).send({ error: 'User already exists', message_code_string: 'user_already_exists' });
    }
    const resCreatedUser = yield (0, users_service_1.create)(req.body);
    if (!resCreatedUser.ok) {
        return res.status(401).send({ error: 'User not created' });
    }
    if (req.body.role !== 'ADMIN') {
        const token = (0, jwt_1.generateToken)(resCreatedUser.data.id);
        req.session.token = token;
    }
    else {
        try {
            sendResetPassword({ body: { email: req.body.email } }, res);
        }
        catch (error) {
            console.log(error);
        }
    }
    return res.status(201).send(resCreatedUser.data);
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        return res.status(404).send({ message_code_string: 'user_not_found' });
    }
    const token = (0, jwt_1.generateToken)(req.user.id);
    if (req.query.jwt === 'true') {
        return res.send({ token });
    }
    req.session.token = token;
    res.send({ message_code_string: 'user_fetched', user: req.user });
});
exports.login = login;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    req.session.destroy((err) => {
        if (err) {
            return res.status(400).send({ message_code_string: 'logout_error' });
        }
        res.clearCookie('express.session.id');
        res.send({ message_code_string: 'logout_success' });
    });
});
exports.logout = logout;
const sendResetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const { body } = req;
    const { email } = body;
    const jwt = (0, jwt_1.generateToken)(email, { resetPassword: true });
    const url = new URL((_b = `${process.env.ROOT_URI}/forgot-password/callback`) !== null && _b !== void 0 ? _b : '');
    url.searchParams.append('code', jwt);
    try {
        const mail = yield (0, mail_service_1.sendResetMail)(email, url.toString());
        return res.status(mail ? 200 : 400).send({ ok: mail });
    }
    catch (error) {
        return res.status(500).send({ ok: false });
    }
});
exports.sendResetPassword = sendResetPassword;
const confirmResetPassword = ({ body, session }, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!body.code || !body.password) {
        return res.sendStatus(400);
    }
    const data = (0, jwt_2.verifyToken)(body.code);
    if (!data.resetPassword) {
        return res.sendStatus(400);
    }
    const resUpdateUser = yield (0, users_service_1.updatePassword)(data.id, body.password);
    if (!resUpdateUser.ok) {
        return res.sendStatus(400);
    }
    const resFindedUser = yield (0, users_service_1.getUserByEmail)(false, data.id);
    if (!resFindedUser.ok) {
        return res.sendStatus(400);
    }
    const token = (0, jwt_1.generateToken)(resFindedUser.data.id);
    session.token = token;
    res.sendStatus(200);
});
exports.confirmResetPassword = confirmResetPassword;
