"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.menu = exports.inGameMenu = void 0;
const wsEvents_controller_1 = require("../controllers/wsEvents.controller");
const game_controller_1 = require("../controllers/game.controller");
const router_service_1 = require("../services/router.service");
const lobbies = [];
/**
 * Forward the menu options, to create, join and etc...
 * @param msgParsed
 * @param wsClient
 * @param lobby
 */
const menu = (msgParsed, wsClient, lobby) => {
    switch (msgParsed.menu) {
        case 'CONNECT':
            if (!msgParsed.uid)
                return (0, wsEvents_controller_1.onDefault)(wsClient);
            (0, wsEvents_controller_1.onConnect)(msgParsed.uid, wsClient);
            break;
        case 'CREATE':
            if (lobby || !wsClient.uid)
                return (0, wsEvents_controller_1.onDefault)(wsClient);
            msgParsed.reward && (0, wsEvents_controller_1.onCreate)(lobbies, wsClient, msgParsed.reward);
            break;
        case 'JOIN':
            if (lobby || !wsClient.uid)
                return (0, wsEvents_controller_1.onDefault)(wsClient);
            msgParsed.gid && (0, wsEvents_controller_1.onJoin)(lobbies, wsClient, msgParsed.gid);
            break;
        case 'START':
            lobby && (0, wsEvents_controller_1.onStart)(lobby);
            break;
        case 'EXIT':
            if (!lobby)
                return (0, wsEvents_controller_1.onDefault)(wsClient);
            (0, wsEvents_controller_1.onExit)(wsClient, lobbies, lobby);
            break;
        case 'IN_GAME':
            if (!(lobby === null || lobby === void 0 ? void 0 : lobby.game))
                throw new Error('No lobby in game');
            if (!(0, game_controller_1.isExpectedPlayer)(wsClient, lobby.game))
                return;
            inGameMenu(msgParsed, wsClient, lobby.game);
            break;
        default:
            (0, wsEvents_controller_1.onDefault)(wsClient);
            console.log('error');
            break;
    }
};
exports.menu = menu;
const inGameMenu = (msgParsed, wsClient, game) => {
    const lastRound = game.getLastRound();
    const player = lastRound.players.find(player => player.uid == wsClient.uid);
    const { turnAction } = msgParsed;
    if (!turnAction || !player)
        return;
    if (player.lastRaised === undefined)
        throw new Error("getNextPlayerWarning func no last raised atribute");
    const wsClientPotentialActions = lastRound.getPotentialActions(player.uid, player.lastRaised);
    if (!wsClientPotentialActions) {
        return;
    }
    if (!wsClientPotentialActions.actions.includes(turnAction))
        return;
    switch (turnAction) {
        case 'BET':
            (0, game_controller_1.onBet)(player, msgParsed, game);
            return;
        case 'CALL':
            if (!wsClientPotentialActions.diference)
                throw new Error("Error not diference and potential action call");
            (0, game_controller_1.onCall)(player, game, wsClientPotentialActions.diference);
            break;
        case 'CHECK':
            (0, game_controller_1.onCheck)(player, game);
            break;
        case 'RAISE':
            if (!wsClientPotentialActions.diference)
                throw new Error("Error not diference and potential action raise");
            (0, game_controller_1.onRaise)(player, msgParsed, wsClientPotentialActions.diference, game);
            break;
        case 'FOLD':
            (0, game_controller_1.onFold)(player, game);
            break;
    }
};
exports.inGameMenu = inGameMenu;
/**
 * This method is used to forward incoming messages.
 * @param wsClient the user that triggers the events.
 */
const router = (wsClient) => {
    const pingInterval = setInterval(() => {
        wsClient.ping();
    }, 10000);
    wsClient.on('message', (msg) => {
        try {
            const lobby = lobbies.find(({ gid }) => gid == wsClient.gid);
            const msgParsed = JSON.parse(msg.toString());
            menu(msgParsed, wsClient, lobby);
        }
        catch (error) {
            (0, router_service_1.clientMsg)(wsClient, 'ERROR', { error: error.message });
            console.log(error.message);
        }
    });
    wsClient.on('error', () => {
        const lobby = lobbies.find(({ gid }) => gid == wsClient.gid);
        if (!lobby)
            return;
        (0, wsEvents_controller_1.onExit)(wsClient, lobbies, lobby);
        (lobby === null || lobby === void 0 ? void 0 : lobby.game) && (0, game_controller_1.onExitGame)(wsClient, lobby);
    });
    wsClient.on('close', () => {
        clearInterval(pingInterval);
        const lobby = lobbies.find(({ gid }) => gid == wsClient.gid);
        if (!lobby)
            return;
        (0, wsEvents_controller_1.onExit)(wsClient, lobbies, lobby);
        (0, game_controller_1.onExitGame)(wsClient, lobby);
    });
};
exports.default = router;
