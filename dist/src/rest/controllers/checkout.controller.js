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
exports.confirmPayment = exports.getCode = void 0;
const jwt_1 = require("../utils/jwt");
const users_service_1 = require("../services/users.service");
const getCode = (req, res) => {
    var _a, _b;
    if (!((_a = req.query) === null || _a === void 0 ? void 0 : _a.email) || !((_b = req.query) === null || _b === void 0 ? void 0 : _b.amount)) {
        return res.sendStatus(400);
    }
    const code = (0, jwt_1.generateToken)('checkout', { email: req.query.email, amount: req.query.amount });
    res.send({ code });
};
exports.getCode = getCode;
const confirmPayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (!((_a = req.query) === null || _a === void 0 ? void 0 : _a.code)) {
        return res.status(400).redirect(process.env.ROOT_URI);
    }
    const code = req.query.code;
    const data = (0, jwt_1.verifyToken)(code);
    if (!data || data.id != 'checkout') {
        return res.status(400).redirect(process.env.ROOT_URI);
    }
    const resFindedUser = yield (0, users_service_1.getUserByEmail)(false, data.email);
    if (!resFindedUser.ok) {
        return res.status(400).redirect(process.env.ROOT_URI);
    }
    const resUpdateUser = yield (0, users_service_1.updateUser)(resFindedUser.data.id, { coin_balance: Number(resFindedUser.data.coin_balance) + Number(data.amount) });
    if (!resUpdateUser.ok) {
        return res.status(400).redirect(process.env.ROOT_URI);
    }
    return res.redirect(`${process.env.ROOT_URI}/profile/${resFindedUser.data.id}`);
});
exports.confirmPayment = confirmPayment;
