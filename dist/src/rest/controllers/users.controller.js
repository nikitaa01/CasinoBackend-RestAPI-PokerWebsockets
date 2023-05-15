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
exports.updateUserController = exports.updateSelf = exports.substractBalance = exports.getSelf = exports.deleteUser = exports.getOne = exports.getAll = void 0;
const users_service_1 = require("../services/users.service");
const getAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const usersRes = yield (0, users_service_1.getUsers)();
        if (!usersRes.ok) {
            return res.status(404).send({ error: 'Users not found' });
        }
        const users = usersRes.data;
        res.send(users);
    }
    catch (e) {
        console.log(e.message);
        res.status(500).send({ error: 'server error' });
    }
});
exports.getAll = getAll;
const getSelf = (req, res) => {
    res.send(req.user);
};
exports.getSelf = getSelf;
const getOne = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const resUser = yield (0, users_service_1.getUser)(req.params.id);
    if (!resUser.ok) {
        return res.status(404).send({ error: 'User not found' });
    }
    return res.send(resUser.data);
});
exports.getOne = getOne;
const updateSelf = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!(req === null || req === void 0 ? void 0 : req.user)) {
        return res.status(404).send({ error: 'User not found' });
    }
    req.body.id = undefined;
    req.body.role = undefined;
    req.body.coin_balance = undefined;
    const resUpdatedUser = yield (0, users_service_1.updateUser)(req.user.id, req.body);
    if (!resUpdatedUser.ok) {
        return res.status(409).send({ error: 'Can\'t upodate user', message_code_string: 'user_not_updated' });
    }
    return res.send(resUpdatedUser.data);
});
exports.updateSelf = updateSelf;
const updateUserController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!(req === null || req === void 0 ? void 0 : req.user)) {
        return res.status(404).send({ error: 'User not found' });
    }
    if (req.user.role !== 'ADMIN') {
        return res.status(403).send({ error: 'Forbidden' });
    }
    req.body.id = undefined;
    const resUpdatedUser = yield (0, users_service_1.updateUser)(req.params.id, req.body);
    if (!resUpdatedUser.ok) {
        return res.status(409).send({ error: 'Can\'t upodate user', message_code_string: 'user_not_updated' });
    }
    return res.send(resUpdatedUser.data);
});
exports.updateUserController = updateUserController;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        return res.status(404).json({ error: 'User not found' });
    }
    const { user } = req;
    const resDeleteUser = yield (0, users_service_1.deleteUser)(user.id);
    if (!resDeleteUser.ok) {
        return res.status(400).json({ error: 'Bad request' });
    }
    return res.status(200).json({ message: 'User deleted' });
});
exports.deleteUser = deleteUser;
const substractBalance = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (!req.user) {
        return res.status(404).json({ message: 'User not found' });
    }
    const { user } = req;
    if (!((_a = req.query) === null || _a === void 0 ? void 0 : _a.amount) || Number(user.coin_balance) < Number(req.query.amount)) {
        return res.status(400).json({ message: 'Bad request. Not enough balance' });
    }
    const resUpdateUser = yield (0, users_service_1.updateUser)(user.id, { coin_balance: Number(user.coin_balance) - Number(req.query.amount) });
    if (!resUpdateUser.ok) {
        return res.status(400).json({ message: 'Bad request. Not enough balance' });
    }
    return res.status(200).json({ message: 'Balance substracted', user: resUpdateUser.data });
});
exports.substractBalance = substractBalance;
