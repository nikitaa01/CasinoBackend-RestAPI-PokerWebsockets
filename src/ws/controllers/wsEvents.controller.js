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
exports.onExit = exports.onDefault = exports.onStart = exports.onJoin = exports.onCreate = exports.onConnect = void 0;
var generateGid_1 = require("../utils/generateGid");
var router_service_1 = require("../services/router.service");
var getWsClientsUid_1 = require("../utils/getWsClientsUid");
var game_1 = require("../models/game");
var game_controller_1 = require("./game.controller");
var users_service_1 = require("../../rest/services/users.service");
var onConnect = function (uid, wsClient) {
    wsClient.uid = uid;
    (0, router_service_1.clientMsg)(wsClient, 'CONNECTED', { client: uid });
};
exports.onConnect = onConnect;
/**
 * This method is used to create a lobby and add it to the lobbies array, it also notifies the user that it has been created.
 * @param lobbies
 * @param wsClient
 * @param reward
 */
var onCreate = function (lobbies, wsClient, reward) {
    var gid = (0, generateGid_1["default"])();
    lobbies.push({ gid: gid, wsClients: [wsClient], reward: reward });
    wsClient.gid = gid;
    (0, router_service_1.clientMsg)(wsClient, 'CREATED', { lobby: gid });
};
exports.onCreate = onCreate;
/**
 * This method is used to join to a lobby by the lobby id, it also notifies the entire lobby of a user joined.
 * @param lobbies
 * @param wsClient
 * @param gidParam
 */
var onJoin = function (lobbies, wsClient, gidParam) {
    var lobby = lobbies.find(function (_a) {
        var gid = _a.gid;
        return gid == gidParam;
    });
    if (lobby == undefined) {
        (0, router_service_1.clientMsg)(wsClient, 'LOBBY_NOT_FOUND', {
            gid: gidParam
        });
        return;
    }
    var gid = lobby.gid, wsClients = lobby.wsClients;
    wsClient.gid = gid;
    wsClients.push(wsClient);
    var wsClientsUids = (0, getWsClientsUid_1["default"])(wsClients);
    var uid = wsClient.uid;
    (0, router_service_1.lobbyMsg)(wsClients, 'JOINED', {
        clients: wsClientsUids,
        client: uid
    });
};
exports.onJoin = onJoin;
var onStart = function (lobby) { return __awaiter(void 0, void 0, void 0, function () {
    var wsClients, responses, validUsers, _loop_1, _i, responses_1, res, invalidUsers, _loop_2, _a, invalidUsers_1, wsClient, _b, validUsers_1, _c, client, uid, options, res;
    var _d, _e;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                wsClients = lobby.wsClients;
                if (lobby.game) {
                    if (lobby.game.getLastRound().getActualStageName() != 'finish')
                        return [2 /*return*/];
                    lobby.game.setNewRound();
                }
                return [4 /*yield*/, Promise.allSettled(wsClients.map(function (wsClient) { return (0, users_service_1.getUser)(wsClient.uid); }))];
            case 1:
                responses = _f.sent();
                validUsers = [];
                _loop_1 = function (res) {
                    if (res.status == 'rejected')
                        return "continue";
                    if (!res.value.ok) {
                        return "continue";
                    }
                    var wsClient = wsClients.find(function (_a) {
                        var uid = _a.uid;
                        return res.value.ok && uid == res.value.data.id;
                    });
                    if (wsClient == undefined)
                        return "continue";
                    if (lobby.reward > Number((_d = res.value.data) === null || _d === void 0 ? void 0 : _d.coin_balance)) {
                        (0, router_service_1.clientMsg)(wsClient, 'NOT_ENOUGH_COINS', {
                            error: "You don't have enough coins to start the game",
                            coin_balance: res.value.data.coin_balance,
                            reward: lobby.reward
                        });
                        var userId = wsClients.findIndex(function (_a) {
                            var uid = _a.uid;
                            return uid == wsClient.uid;
                        });
                        wsClients.splice(userId, 1);
                        wsClient.close();
                    }
                    else {
                        validUsers.push({ client: wsClient, uid: wsClient.uid, options: { coin_balance: Number((_e = res.value.data) === null || _e === void 0 ? void 0 : _e.coin_balance) - lobby.reward } });
                    }
                };
                for (_i = 0, responses_1 = responses; _i < responses_1.length; _i++) {
                    res = responses_1[_i];
                    _loop_1(res);
                }
                invalidUsers = wsClients.filter(function (wsClient) { return !validUsers.map(function (e) { return e.client; }).includes(wsClient); });
                _loop_2 = function (wsClient) {
                    wsClient.close();
                    var userId = wsClients.findIndex(function (_a) {
                        var uid = _a.uid;
                        return uid == wsClient.uid;
                    });
                    wsClients.splice(userId, 1);
                };
                for (_a = 0, invalidUsers_1 = invalidUsers; _a < invalidUsers_1.length; _a++) {
                    wsClient = invalidUsers_1[_a];
                    _loop_2(wsClient);
                }
                if (wsClients.length < 2) {
                    (0, router_service_1.clientMsg)(wsClients[0], 'NOT_ENOUGH_PLAYERS', {
                        error: "You need at least 2 players to start the game"
                    });
                    return [2 /*return*/];
                }
                _b = 0, validUsers_1 = validUsers;
                _f.label = 2;
            case 2:
                if (!(_b < validUsers_1.length)) return [3 /*break*/, 5];
                _c = validUsers_1[_b], client = _c.client, uid = _c.uid, options = _c.options;
                return [4 /*yield*/, (0, users_service_1.updateUser)(uid, options)];
            case 3:
                res = _f.sent();
                if (!res.ok) {
                    (0, router_service_1.clientMsg)(client, 'ERROR', {
                        error: "An error has ocurred while updating the user"
                    });
                }
                _f.label = 4;
            case 4:
                _b++;
                return [3 /*break*/, 2];
            case 5:
                (0, router_service_1.lobbyMsg)(wsClients, 'STARTED');
                lobby.game = new game_1["default"](wsClients, lobby.reward);
                (0, game_controller_1.startingRound)(lobby.game);
                return [2 /*return*/];
        }
    });
}); };
exports.onStart = onStart;
var onDefault = function (wsClient) {
    (0, router_service_1.clientMsg)(wsClient, 'NOT_FOUND', {
        error: "menu atribute not found or menu value is undefined"
    });
};
exports.onDefault = onDefault;
var onExit = function (wsClient, lobbies, lobby) {
    var wsClients = lobby.wsClients;
    var wsClientI = wsClients.findIndex(function (_a) {
        var uid = _a.uid;
        return uid == wsClient.uid;
    });
    if (wsClientI == -1)
        return;
    var client = wsClients[wsClientI].uid;
    wsClients.splice(wsClientI, 1);
    if (wsClients.length == 0) {
        lobbies.splice(lobbies.indexOf(lobby), 1);
        return;
    }
    var wsClientsUids = (0, getWsClientsUid_1["default"])(wsClients);
    (0, router_service_1.lobbyMsg)(wsClients, 'EXITED', { clients: wsClientsUids, client: client });
};
exports.onExit = onExit;
