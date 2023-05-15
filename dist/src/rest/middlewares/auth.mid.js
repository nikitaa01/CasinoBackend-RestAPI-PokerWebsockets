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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authByCredentials = exports.auth = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const users_service_1 = require("../services/users.service");
const bcrypt_1 = __importDefault(require("bcrypt"));
const findUser = (token, req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const decoded = (0, jsonwebtoken_1.verify)(token, process.env.SECRET);
        if (!(decoded === null || decoded === void 0 ? void 0 : decoded.id)) {
            return res.status(401).json({ message: 'Unauthorized. No user attached to that token' });
        }
        const resFindedUser = yield (0, users_service_1.getUser)(decoded.id);
        if (!resFindedUser.ok) {
            return res.status(404).json({ message: 'User not found' });
        }
        req.user = resFindedUser.data;
        next();
    }
    catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
});
const auth = (strict = true) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const token = req.session.token;
        if (!token && strict) {
            if (req.headers.authorization) {
                const authHeader = req.headers.authorization;
                const token = authHeader.split(' ')[1];
                return findUser(token, req, res, next);
            }
            return res.status(401).json({ message: 'Unauthorized. No token provided' });
        }
        if (!token)
            return next();
        return findUser(token, req, res, next);
    });
};
exports.auth = auth;
const authByCredentials = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const resFindedUser = yield (0, users_service_1.getUserByEmail)(true, email);
        if (!resFindedUser.ok) {
            return res.status(404).json({ message: 'User not found', field: 'email', message_code_string: 'user_not_found' });
        }
        req.user = resFindedUser.data;
        if (!(yield bcrypt_1.default.compare(password, req.user.password))) {
            return res.status(401).json({ message: 'Unauthorized. Wrong password', field: 'password', message_code_string: 'wrong_password' });
        }
        next();
    }
    catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
});
exports.authByCredentials = authByCredentials;
