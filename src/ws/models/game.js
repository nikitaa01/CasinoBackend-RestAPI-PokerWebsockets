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
var getWsClientsUid_1 = require("../utils/getWsClientsUid");
var round_1 = require("./round");
var turn_1 = require("./turn");
var Game = /** @class */ (function () {
    function Game(activePlayers, reward) {
        var persBalance = reward;
        var smallBlind = Math.trunc(persBalance / 20);
        this.activePlayers = activePlayers.map(function (player) {
            player.lastRaised = false;
            player.balance = persBalance;
            return player;
        });
        this.smallBlind = smallBlind;
        this.bigBlind = smallBlind * 2;
        this.rounds = [this.getNewRound()];
    }
    Game.prototype.getNewRound = function () {
        var dealer = this.activePlayers.shift();
        if (!dealer)
            throw new Error('Game players array is empty');
        this.activePlayers.push(dealer);
        var players = [this.getTurnPlayer(this.activePlayers, 0), this.getTurnPlayer(this.activePlayers, 1)];
        players[0].balance = players[0].balance - this.smallBlind;
        players[1].balance = players[1].balance - this.bigBlind;
        players[1].lastRaised = true;
        var round = new round_1["default"]([
            new turn_1["default"](players[0].uid, 'BET', this.smallBlind),
            new turn_1["default"](players[1].uid, 'RAISE', this.bigBlind),
        ], this.activePlayers, (this.smallBlind + this.bigBlind));
        return round;
    };
    Game.prototype.setNewRound = function () {
        this.rounds.push(this.getNewRound());
    };
    Game.prototype.resetLastRaised = function () {
        this.getLastRound().players = this.getLastRound().players.map(function (player) {
            player.lastRaised = false;
            return player;
        });
    };
    Game.prototype.getLastRound = function () {
        return this.rounds.at(-1);
    };
    Game.prototype.getTurnPong = function (turn) {
        var players = this.getLastRound().players;
        var player = players.find(function (wsClient) { return wsClient.uid == turn.playerUid; });
        if (!player)
            return;
        if (turn.amount && player.balance)
            player.balance - turn.amount;
        turn.sendedPong = true;
        return { wsClients: players, status: turn.action, msg: turn.getGroupMsg() };
    };
    Game.prototype.getTurnPongQueue = function () {
        var pongQueue = [];
        var noPongTurns = this.getLastRound().getActualStage().filter(function (_a) {
            var sendedPong = _a.sendedPong;
            return !sendedPong;
        });
        for (var _i = 0, noPongTurns_1 = noPongTurns; _i < noPongTurns_1.length; _i++) {
            var turn = noPongTurns_1[_i];
            var msg = this.getTurnPong(turn);
            if (!msg)
                return;
            pongQueue.push(msg);
        }
        return pongQueue;
    };
    Game.prototype.getNextPlayerWarning = function () {
        var _a, _b;
        var turnPlayer = this.getTurnPlayer();
        if ((turnPlayer === null || turnPlayer === void 0 ? void 0 : turnPlayer.lastRaised) === undefined)
            return;
        var msg = this.getLastRound().getPotentialActions(turnPlayer.uid, turnPlayer.lastRaised);
        if (!msg)
            return;
        /* TODO: refractorizar como sacar el lowerPlayerBalance */
        var lastRound = this.getLastRound();
        var lowerPlayerBalance = lastRound.getLowerPlayerBalance();
        var lowerPlayerDiference = lastRound.getHighestPersAmount() - lastRound.getPersAmount(lowerPlayerBalance.uid);
        var maxAmount = lowerPlayerBalance.uid !== turnPlayer.uid
            ? ((_a = lowerPlayerBalance.balance) !== null && _a !== void 0 ? _a : 0 - lowerPlayerDiference) + lastRound.getHighestPersAmount() - lastRound.getPersAmount(turnPlayer.uid)
            : (_b = lowerPlayerBalance.balance) !== null && _b !== void 0 ? _b : 0;
        return {
            wsClient: turnPlayer, status: 'WAITING', msg: __assign(__assign({}, msg), { maxAmount: maxAmount, balance: turnPlayer.balance })
        };
    };
    Game.prototype.getPersonalCards = function () {
        var allCards = this.getLastRound().roundDeck;
        var cardsToSend = [];
        for (var _i = 0, _a = this.getLastRound().players; _i < _a.length; _i++) {
            var player = _a[_i];
            var cards = [allCards.pop(), allCards.pop()];
            if (cards.includes(undefined))
                return;
            player.cards = cards;
            cardsToSend.push({ wsClient: player, status: 'PERS_CARDS', cards: cards });
        }
        return cardsToSend;
    };
    Game.prototype.getTurnPlayer = function (players, numTurns) {
        if (players === void 0) { players = this.getLastRound().players; }
        if (numTurns === void 0) { numTurns = -1; }
        var numTurnsReturn = numTurns;
        if (numTurnsReturn == -1) {
            var playersUids_1 = (0, getWsClientsUid_1["default"])(players);
            numTurnsReturn = this.getLastRound().getActualStage()
                .filter(function (_a) {
                var playerUid = _a.playerUid;
                return playersUids_1.includes(playerUid);
            })
                .length;
        }
        return players[numTurnsReturn % players.length];
    };
    Game.prototype.checkIfGameEnd = function () {
        return this.activePlayers.length == 1;
    };
    return Game;
}());
exports["default"] = Game;
