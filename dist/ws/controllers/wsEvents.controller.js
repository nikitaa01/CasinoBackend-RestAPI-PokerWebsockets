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
exports.onExit = exports.onDefault = exports.onStart = exports.onJoin = exports.onCreate = exports.onConnect = void 0;
const generateGid_1 = __importDefault(require("../utils/generateGid"));
const router_service_1 = require("../services/router.service");
const getWsClientsUid_1 = __importDefault(require("../utils/getWsClientsUid"));
const game_1 = __importDefault(require("../models/game"));
const game_controller_1 = require("./game.controller");
const users_service_1 = require("../../rest/services/users.service");
const onConnect = (uid, wsClient) => {
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
const onCreate = (lobbies, wsClient, reward) => {
    const gid = (0, generateGid_1.default)();
    lobbies.push({ gid, wsClients: [wsClient], reward });
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
const onJoin = (lobbies, wsClient, gidParam) => {
    const lobby = lobbies.find(({ gid }) => gid == gidParam);
    if (lobby == undefined) {
        (0, router_service_1.clientMsg)(wsClient, 'LOBBY_NOT_FOUND', {
            gid: gidParam
        });
        return;
    }
    const { gid, wsClients } = lobby;
    wsClient.gid = gid;
    wsClients.push(wsClient);
    const wsClientsUids = (0, getWsClientsUid_1.default)(wsClients);
    const { uid } = wsClient;
    (0, router_service_1.lobbyMsg)(wsClients, 'JOINED', {
        clients: wsClientsUids,
        client: uid,
    });
};
exports.onJoin = onJoin;
const onStart = (lobby) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { wsClients } = lobby;
    if (lobby.game) {
        if (lobby.game.getLastRound().getActualStageName() != 'finish')
            return;
        lobby.game.setNewRound();
    }
    const responses = yield Promise.allSettled(wsClients.map(wsClient => (0, users_service_1.getUser)(wsClient.uid)));
    const validUsers = [];
    for (const res of responses) {
        if (res.status == 'rejected')
            continue;
        if (!res.value.ok) {
            continue;
        }
        const wsClient = wsClients.find(({ uid }) => res.value.ok && uid == res.value.data.id);
        if (wsClient == undefined)
            continue;
        if (lobby.reward > Number((_a = res.value.data) === null || _a === void 0 ? void 0 : _a.coin_balance)) {
            (0, router_service_1.clientMsg)(wsClient, 'NOT_ENOUGH_COINS', {
                error: "You don't have enough coins to start the game",
                coin_balance: res.value.data.coin_balance,
                reward: lobby.reward
            });
            const userId = wsClients.findIndex(({ uid }) => uid == wsClient.uid);
            wsClients.splice(userId, 1);
            wsClient.close();
        }
        else {
            validUsers.push({ client: wsClient, uid: wsClient.uid, options: { coin_balance: Number((_b = res.value.data) === null || _b === void 0 ? void 0 : _b.coin_balance) - lobby.reward } });
        }
    }
    const invalidUsers = wsClients.filter(wsClient => !validUsers.map(e => e.client).includes(wsClient));
    for (const wsClient of invalidUsers) {
        wsClient.close();
        const userId = wsClients.findIndex(({ uid }) => uid == wsClient.uid);
        wsClients.splice(userId, 1);
    }
    if (wsClients.length < 2) {
        (0, router_service_1.clientMsg)(wsClients[0], 'NOT_ENOUGH_PLAYERS', {
            error: "You need at least 2 players to start the game"
        });
        return;
    }
    for (const { client, uid, options } of validUsers) {
        const res = yield (0, users_service_1.updateUser)(uid, options);
        if (!res.ok) {
            (0, router_service_1.clientMsg)(client, 'ERROR', {
                error: "An error has ocurred while updating the user"
            });
        }
    }
    (0, router_service_1.lobbyMsg)(wsClients, 'STARTED');
    lobby.game = new game_1.default(wsClients, lobby.reward);
    (0, game_controller_1.startingRound)(lobby.game);
});
exports.onStart = onStart;
const onDefault = (wsClient) => {
    (0, router_service_1.clientMsg)(wsClient, 'NOT_FOUND', {
        error: "menu atribute not found or menu value is undefined"
    });
};
exports.onDefault = onDefault;
const onExit = (wsClient, lobbies, lobby) => {
    const { wsClients } = lobby;
    const wsClientI = wsClients.findIndex(({ uid }) => uid == wsClient.uid);
    if (wsClientI == -1)
        return;
    const { uid: client } = wsClients[wsClientI];
    wsClients.splice(wsClientI, 1);
    if (wsClients.length == 0) {
        lobbies.splice(lobbies.indexOf(lobby), 1);
        return;
    }
    const wsClientsUids = (0, getWsClientsUid_1.default)(wsClients);
    (0, router_service_1.lobbyMsg)(wsClients, 'EXITED', { clients: wsClientsUids, client });
};
exports.onExit = onExit;
