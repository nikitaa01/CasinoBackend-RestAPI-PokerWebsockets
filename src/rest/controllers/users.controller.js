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
exports.updateUserController = exports.updateSelf = exports.substractBalance = exports.getSelf = exports.deleteUser = exports.getOne = exports.getAll = void 0;
var users_service_1 = require("../services/users.service");
var getAll = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var usersRes, users, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, users_service_1.getUsers)()];
            case 1:
                usersRes = _a.sent();
                if (!usersRes.ok) {
                    return [2 /*return*/, res.status(404).send({ error: 'Users not found' })];
                }
                users = usersRes.data;
                res.send(users);
                return [3 /*break*/, 3];
            case 2:
                e_1 = _a.sent();
                console.log(e_1.message);
                res.status(500).send({ error: 'server error' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getAll = getAll;
var getSelf = function (req, res) {
    res.send(req.user);
};
exports.getSelf = getSelf;
var getOne = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var resUser;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, users_service_1.getUser)(req.params.id)];
            case 1:
                resUser = _a.sent();
                if (!resUser.ok) {
                    return [2 /*return*/, res.status(404).send({ error: 'User not found' })];
                }
                return [2 /*return*/, res.send(resUser.data)];
        }
    });
}); };
exports.getOne = getOne;
var updateSelf = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var resUpdatedUser;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!(req === null || req === void 0 ? void 0 : req.user)) {
                    return [2 /*return*/, res.status(404).send({ error: 'User not found' })];
                }
                req.body.id = undefined;
                req.body.role = undefined;
                req.body.coin_balance = undefined;
                return [4 /*yield*/, (0, users_service_1.updateUser)(req.user.id, req.body)];
            case 1:
                resUpdatedUser = _a.sent();
                if (!resUpdatedUser.ok) {
                    return [2 /*return*/, res.status(409).send({ error: 'Can\'t upodate user', message_code_string: 'user_not_updated' })];
                }
                return [2 /*return*/, res.send(resUpdatedUser.data)];
        }
    });
}); };
exports.updateSelf = updateSelf;
var updateUserController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var resUpdatedUser;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!(req === null || req === void 0 ? void 0 : req.user)) {
                    return [2 /*return*/, res.status(404).send({ error: 'User not found' })];
                }
                if (req.user.role !== 'ADMIN') {
                    return [2 /*return*/, res.status(403).send({ error: 'Forbidden' })];
                }
                req.body.id = undefined;
                return [4 /*yield*/, (0, users_service_1.updateUser)(req.params.id, req.body)];
            case 1:
                resUpdatedUser = _a.sent();
                if (!resUpdatedUser.ok) {
                    return [2 /*return*/, res.status(409).send({ error: 'Can\'t upodate user', message_code_string: 'user_not_updated' })];
                }
                return [2 /*return*/, res.send(resUpdatedUser.data)];
        }
    });
}); };
exports.updateUserController = updateUserController;
var deleteUser = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, resDeleteUser;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!req.user) {
                    return [2 /*return*/, res.status(404).json({ error: 'User not found' })];
                }
                user = req.user;
                return [4 /*yield*/, (0, users_service_1.deleteUser)(user.id)];
            case 1:
                resDeleteUser = _a.sent();
                if (!resDeleteUser.ok) {
                    return [2 /*return*/, res.status(400).json({ error: 'Bad request' })];
                }
                return [2 /*return*/, res.status(200).json({ message: 'User deleted' })];
        }
    });
}); };
exports.deleteUser = deleteUser;
var substractBalance = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, resUpdateUser;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (!req.user) {
                    return [2 /*return*/, res.status(404).json({ message: 'User not found' })];
                }
                user = req.user;
                if (!((_a = req.query) === null || _a === void 0 ? void 0 : _a.amount) || Number(user.coin_balance) < Number(req.query.amount)) {
                    return [2 /*return*/, res.status(400).json({ message: 'Bad request. Not enough balance' })];
                }
                return [4 /*yield*/, (0, users_service_1.updateUser)(user.id, { coin_balance: Number(user.coin_balance) - Number(req.query.amount) })];
            case 1:
                resUpdateUser = _b.sent();
                if (!resUpdateUser.ok) {
                    return [2 /*return*/, res.status(400).json({ message: 'Bad request. Not enough balance' })];
                }
                return [2 /*return*/, res.status(200).json({ message: 'Balance substracted', user: resUpdateUser.data })];
        }
    });
}); };
exports.substractBalance = substractBalance;
