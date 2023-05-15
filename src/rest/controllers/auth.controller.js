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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.confirmResetPassword = exports.sendResetPassword = exports.logout = exports.login = exports.register = exports.googleCallback = exports.redirectToGoogleAuth = void 0;
var auth_service_1 = require("../services/auth.service");
var users_service_1 = require("../services/users.service");
var jwt_1 = require("../utils/jwt");
var mail_service_1 = require("../services/mail.service");
var jwt_2 = require("../utils/jwt");
var redirectToGoogleAuth = function (_req, res) {
    res.redirect((0, auth_service_1.getGoogleAuthURL)());
};
exports.redirectToGoogleAuth = redirectToGoogleAuth;
var googleCallback = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var resToken, token, resProfile, profile, resFindedUser, resCreatedUser;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, auth_service_1.getGoogleToken)(req.query.code)];
            case 1:
                resToken = _a.sent();
                if (!resToken.ok) {
                    return [2 /*return*/, res.status(400).redirect("".concat(process.env.ROOT_URI, "/login"))];
                }
                token = resToken.data;
                return [4 /*yield*/, (0, auth_service_1.getGoogleProfile)(token.access_token, token.id_token)];
            case 2:
                resProfile = _a.sent();
                if (!resProfile.ok) {
                    return [2 /*return*/, res.status(400).redirect("".concat(process.env.ROOT_URI, "/login"))];
                }
                profile = resProfile.data;
                return [4 /*yield*/, (0, users_service_1.getUserByOauth)(profile.id)];
            case 3:
                resFindedUser = _a.sent();
                if (!!resFindedUser.ok) return [3 /*break*/, 5];
                return [4 /*yield*/, (0, users_service_1.create)({
                        first_name: profile.given_name,
                        last_name: profile.family_name,
                        email: profile.email,
                        password: profile.id,
                        avatar_url: profile.picture,
                        oauth_provider: "google",
                        oauth_provider_id: profile.id
                    })];
            case 4:
                resCreatedUser = _a.sent();
                if (!resCreatedUser.ok) {
                    return [2 /*return*/, res.status(400).redirect("".concat(process.env.ROOT_URI, "/login"))];
                }
                req.session.token = (0, jwt_1.generateToken)(resCreatedUser.data.id);
                return [2 /*return*/, res.redirect("".concat(process.env.ROOT_URI))];
            case 5:
                req.session.token = (0, jwt_1.generateToken)(resFindedUser.data.id);
                return [2 /*return*/, res.redirect("".concat(process.env.ROOT_URI))];
        }
    });
}); };
exports.googleCallback = googleCallback;
var register = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var resFindedUser, resCreatedUser, token;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (req.body.role == 'ADMIN' && ((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) != 'ADMIN') {
                    return [2 /*return*/, res.status(403).send({ error: "Only admin users can create admin users" })];
                }
                return [4 /*yield*/, (0, users_service_1.getUserByEmail)(false, req.body.email)];
            case 1:
                resFindedUser = _b.sent();
                if (resFindedUser.ok) {
                    return [2 /*return*/, res.status(409).send({ error: 'User already exists', message_code_string: 'user_already_exists' })];
                }
                return [4 /*yield*/, (0, users_service_1.create)(req.body)];
            case 2:
                resCreatedUser = _b.sent();
                if (!resCreatedUser.ok) {
                    return [2 /*return*/, res.status(401).send({ error: 'User not created' })];
                }
                if (req.body.role !== 'ADMIN') {
                    token = (0, jwt_1.generateToken)(resCreatedUser.data.id);
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
                return [2 /*return*/, res.status(201).send(resCreatedUser.data)];
        }
    });
}); };
exports.register = register;
var login = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var token;
    return __generator(this, function (_a) {
        if (!req.user) {
            return [2 /*return*/, res.status(404).send({ message_code_string: 'user_not_found' })];
        }
        token = (0, jwt_1.generateToken)(req.user.id);
        if (req.query.jwt === 'true') {
            return [2 /*return*/, res.send({ token: token })];
        }
        req.session.token = token;
        res.send({ message_code_string: 'user_fetched', user: req.user });
        return [2 /*return*/];
    });
}); };
exports.login = login;
var logout = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        req.session.destroy(function (err) {
            if (err) {
                return res.status(400).send({ message_code_string: 'logout_error' });
            }
            res.clearCookie('express.session.id');
            res.send({ message_code_string: 'logout_success' });
        });
        return [2 /*return*/];
    });
}); };
exports.logout = logout;
var sendResetPassword = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var body, email, jwt, url, mail, error_1;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                body = req.body;
                email = body.email;
                jwt = (0, jwt_1.generateToken)(email, { resetPassword: true });
                url = new URL((_a = "".concat(process.env.ROOT_URI, "/forgot-password/callback")) !== null && _a !== void 0 ? _a : '');
                url.searchParams.append('code', jwt);
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, (0, mail_service_1.sendResetMail)(email, url.toString())];
            case 2:
                mail = _b.sent();
                return [2 /*return*/, res.status(mail ? 200 : 400).send({ ok: mail })];
            case 3:
                error_1 = _b.sent();
                return [2 /*return*/, res.status(500).send({ ok: false })];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.sendResetPassword = sendResetPassword;
var confirmResetPassword = function (_a, res) {
    var body = _a.body, session = _a.session;
    return __awaiter(void 0, void 0, void 0, function () {
        var data, resUpdateUser, resFindedUser, token;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!body.code || !body.password) {
                        return [2 /*return*/, res.sendStatus(400)];
                    }
                    data = (0, jwt_2.verifyToken)(body.code);
                    if (!data.resetPassword) {
                        return [2 /*return*/, res.sendStatus(400)];
                    }
                    return [4 /*yield*/, (0, users_service_1.updatePassword)(data.id, body.password)];
                case 1:
                    resUpdateUser = _b.sent();
                    if (!resUpdateUser.ok) {
                        return [2 /*return*/, res.sendStatus(400)];
                    }
                    return [4 /*yield*/, (0, users_service_1.getUserByEmail)(false, data.id)];
                case 2:
                    resFindedUser = _b.sent();
                    if (!resFindedUser.ok) {
                        return [2 /*return*/, res.sendStatus(400)];
                    }
                    token = (0, jwt_1.generateToken)(resFindedUser.data.id);
                    session.token = token;
                    res.sendStatus(200);
                    return [2 /*return*/];
            }
        });
    });
};
exports.confirmResetPassword = confirmResetPassword;
