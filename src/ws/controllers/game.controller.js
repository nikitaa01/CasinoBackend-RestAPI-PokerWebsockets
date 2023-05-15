"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
exports.onExitGame = exports.onFold = exports.onBet = exports.onRaise = exports.onCheck = exports.onCall = exports.isExpectedPlayer = exports.setNewStage = exports.startingRound = void 0;
var users_service_1 = require("../../rest/services/users.service");
var turn_1 = require("../models/turn");
var router_service_1 = require("../services/router.service");
var nextPlayerMsg = function (game) {
    var waitingCall = game.getNextPlayerWarning();
    if (!waitingCall) {
        setNewStage(game);
        return;
    }
    (0, router_service_1.clientMsg)(waitingCall.wsClient, waitingCall.status, waitingCall.msg);
};
var startingRound = function (game) {
    var _a;
    var lastRound = game.getLastRound();
    var players = lastRound.players;
    var dealerPlayer = players.at(-1);
    (0, router_service_1.lobbyMsg)(players, 'DEALER', { client: dealerPlayer.uid });
    (0, router_service_1.lobbyMsg)(players, 'NEW_STAGE', { stage: lastRound.getActualStageName() });
    var playersCardObj = game.getPersonalCards();
    if (!playersCardObj)
        throw new Error("Cards not found");
    for (var _i = 0, playersCardObj_1 = playersCardObj; _i < playersCardObj_1.length; _i++) {
        var msg = playersCardObj_1[_i];
        if (!msg)
            throw new Error('erro');
        (0, router_service_1.clientMsg)(msg.wsClient, msg.status, msg.cards);
    }
    var messageQueue = game.getTurnPongQueue();
    if (!messageQueue)
        return;
    var _loop_1 = function (msg) {
        if (!msg)
            throw new Error('erro');
        (0, router_service_1.lobbyMsg)(msg.wsClients, 'DONE_ACTION', __assign(__assign({}, msg.msg), { action: msg.status, balance: (_a = players.find(function (p) { return p.uid == msg.msg.uid; })) === null || _a === void 0 ? void 0 : _a.balance, tableAmount: lastRound.amount }));
    };
    for (var _b = 0, messageQueue_1 = messageQueue; _b < messageQueue_1.length; _b++) {
        var msg = messageQueue_1[_b];
        _loop_1(msg);
    }
    nextPlayerMsg(game);
};
exports.startingRound = startingRound;
var quitNoBalancePlayers = function (game) {
    for (var _i = 0, _a = game.activePlayers; _i < _a.length; _i++) {
        var player = _a[_i];
        if (player.balance == 0) {
            player.close();
            game.activePlayers.splice(game.activePlayers.indexOf(player), 1);
            (0, router_service_1.lobbyMsg)(game.activePlayers, 'LOSE', { uid: player.uid });
        }
    }
};
var checkEndGame = function (game, lastRound) {
    if (game.activePlayers.filter(function (p) { var _a; return (_a = p.balance) !== null && _a !== void 0 ? _a : -1 > 0; }).length == 1) {
        console.log(game.activePlayers[0].balance);
        console.log({ coin_balance: Number(game.activePlayers[0].balance) + Number(lastRound.amount) });
        (0, users_service_1.updateUser)(game.activePlayers[0].uid, { coin_balance: Number(game.activePlayers[0].balance) })["catch"](function (err) { return console.log(err); });
        var winner = game.activePlayers[0];
        lastRound.amount = 0;
        (0, router_service_1.clientMsg)(winner, 'GAME_END', { reward: Number(winner.balance) });
        winner.close();
    }
};
var setNewStage = function (game) {
    var lastRound = game.getLastRound();
    var players = lastRound.players;
    game.resetLastRaised();
    lastRound.setNewStage();
    // TODO: guardar en la base de datos los resultados
    if (lastRound.getActualStageName() == 'finish') {
        var winnerRes_1 = lastRound.getWinner();
        var eachWinnerProffit_1 = lastRound.amount / winnerRes_1.winners.length;
        game.activePlayers = game.activePlayers.map(function (p) {
            var _a;
            if (winnerRes_1.winners.includes(p.uid)) {
                p.balance = ((_a = p.balance) !== null && _a !== void 0 ? _a : 0) + eachWinnerProffit_1;
            }
            return p;
        });
        (0, router_service_1.lobbyMsg)(game.getLastRound().players, 'FINISH', {
            winners: winnerRes_1.winners.map(function (winner) { return ({
                uid: winner,
                proffit: eachWinnerProffit_1
            }); }),
            combinations: winnerRes_1.combinations
        });
        quitNoBalancePlayers(game);
        checkEndGame(game, lastRound);
        return;
    }
    (0, router_service_1.lobbyMsg)(players, 'NEW_STAGE', { stage: lastRound.getActualStageName() });
    (0, router_service_1.lobbyMsg)(players, 'COMMON_CARDS', lastRound.getStageCards());
    nextPlayerMsg(game);
};
exports.setNewStage = setNewStage;
var isExpectedPlayer = function (_a, game) {
    var uid = _a.uid;
    if (!game)
        return false;
    if (uid != game.getTurnPlayer().uid)
        return false;
    return true;
};
exports.isExpectedPlayer = isExpectedPlayer;
var getMaxAmount = function (lastRound, diference) {
    var _a;
    var lowerPlayerBalance = lastRound.getLowerPlayerBalance();
    var lowerPlayerDiference = lastRound.getHighestPersAmount() - lastRound.getPersAmount(lowerPlayerBalance.uid);
    return ((_a = lowerPlayerBalance.balance) !== null && _a !== void 0 ? _a : 0 - lowerPlayerDiference) + diference;
};
var onCall = function (player, game, diference) {
    if (!player.balance || player.balance < diference) {
        return;
    }
    var players = game.getLastRound().players;
    var newTurn = new turn_1["default"](player.uid, 'CALL', diference);
    var lastRound = game.getLastRound();
    lastRound.getActualStage().push(newTurn);
    lastRound.amount += Number(diference);
    player.balance = player.balance - diference;
    (0, router_service_1.lobbyMsg)(players, 'DONE_ACTION', __assign(__assign({}, newTurn.getGroupMsg()), { action: 'CALL', balance: player.balance, tableAmount: lastRound.amount }));
    nextPlayerMsg(game);
};
exports.onCall = onCall;
var onCheck = function (player, game) {
    var lastRound = game.getLastRound();
    var players = lastRound.players;
    var newTurn = new turn_1["default"](player.uid, 'CHECK');
    var actualStage = lastRound.getActualStage();
    if (actualStage.length == 0)
        player.lastRaised = true;
    actualStage.push(newTurn);
    (0, router_service_1.lobbyMsg)(players, 'DONE_ACTION', __assign(__assign({}, newTurn.getGroupMsg()), { action: 'CHECK', balance: player.balance, tableAmount: lastRound.amount }));
    nextPlayerMsg(game);
};
exports.onCheck = onCheck;
var onRaise = function (player, msgParsed, diference, game) {
    if (!player.balance) {
        return;
    }
    var lastRound = game.getLastRound();
    var maxAmount = getMaxAmount(lastRound, diference);
    if (!msgParsed.amount || diference >= msgParsed.amount || Number(player.balance) < Number(msgParsed.amount) || Number(maxAmount) < Number(msgParsed.amount)) {
        (0, router_service_1.clientMsg)(player, 'NOT_DONE_ACTION', { err: 'DIFERENCE IS HIGHER THAN AMOUNT' });
        return;
    }
    var players = lastRound.players;
    var newTurn = new turn_1["default"](player.uid, 'RAISE', Number(msgParsed.amount));
    game.resetLastRaised();
    player.lastRaised = true;
    player.balance -= Number(msgParsed.amount);
    lastRound.getActualStage().push(newTurn);
    lastRound.amount += Number(msgParsed.amount);
    (0, router_service_1.lobbyMsg)(players, 'DONE_ACTION', __assign(__assign({}, newTurn.getGroupMsg()), { action: 'RAISE', playerAmount: Number(msgParsed.amount), balance: player.balance, tableAmount: lastRound.amount }));
    nextPlayerMsg(game);
};
exports.onRaise = onRaise;
var onBet = function (player, msgParsed, game) {
    if (!player.balance) {
        return;
    }
    var lastRound = game.getLastRound();
    var maxAmount = getMaxAmount(lastRound, 0);
    if (!msgParsed.amount || Number(player.balance) < Number(msgParsed.amount) || Number(maxAmount) < Number(msgParsed.amount)) {
        (0, router_service_1.clientMsg)(player, 'NOT_DONE_ACTION', { err: 'NOT AMOUNT WITH ACTION BET' });
        return;
    }
    var newTurn = new turn_1["default"](player.uid, 'BET', Number(msgParsed.amount));
    game.resetLastRaised();
    player.lastRaised = true;
    player.balance -= Number(msgParsed.amount);
    lastRound.getActualStage().push(newTurn);
    lastRound.amount += Number(msgParsed.amount);
    (0, router_service_1.lobbyMsg)(lastRound.players, 'DONE_ACTION', __assign(__assign({}, newTurn.getGroupMsg()), { action: 'BET', playerAmount: Number(msgParsed.amount), balance: player.balance, tableAmount: lastRound.amount }));
    nextPlayerMsg(game);
};
exports.onBet = onBet;
// FIXME: Arreglar el unfold para que cuando sea nueva ronda pueda volver a participar el que se ha hecho fold
var onFold = function (player, game) {
    var newTurn = new turn_1["default"](player.uid, 'RAISE');
    var lastRound = game.getLastRound();
    var indexPlayer = lastRound.players.findIndex(function (_a) {
        var uid = _a.uid;
        return uid == player.uid;
    });
    (0, router_service_1.lobbyMsg)(lastRound.players, 'DONE_ACTION', __assign(__assign({}, newTurn.getGroupMsg()), { action: 'FOLD', tableAmount: lastRound.amount }));
    lastRound.players.splice(indexPlayer, 1);
    nextPlayerMsg(game);
};
exports.onFold = onFold;
var onExitGame = function (player, lobby) {
    var _a, _b;
    var game = lobby.game;
    if (!game)
        return;
    var lastRound = game.getLastRound();
    lastRound.amount += (_a = Number(player.balance)) !== null && _a !== void 0 ? _a : 0;
    game.activePlayers = game.activePlayers.filter(function (p) { return p.uid != player.uid; });
    lastRound.players = lastRound.players.filter(function (p) { return p.uid != player.uid; });
    if (game.activePlayers.filter(function (p) { var _a; return (_a = p.balance) !== null && _a !== void 0 ? _a : -1 > 0; }).length == 1) {
        var balance = (_b = game.activePlayers[0]) === null || _b === void 0 ? void 0 : _b.balance;
        if (!balance) {
            balance = 0;
        }
        game.activePlayers[0].balance = Number(lastRound.amount) + balance;
        lastRound.amount = 0;
    }
    checkEndGame(game, lastRound);
    /* FIXME: msg provisional, hay que arrgelarlo */
    (0, router_service_1.lobbyMsg)(lastRound.players, 'EXITEDE_GAME', { uid: player.uid, tableAmount: lastRound.amount });
    nextPlayerMsg(game);
};
exports.onExitGame = onExitGame;
