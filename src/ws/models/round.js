"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
var deck_1 = require("./deck");
var Round = /** @class */ (function () {
    function Round(preflop, players, initialAmount) {
        this.stages = [preflop];
        this.roundDeck = deck_1["default"].instance.getRoundDeck(players.length);
        this.players = players;
        this.amount = initialAmount;
    }
    Round.prototype.getPotentialActions = function (playerUid, lastRaised) {
        if (lastRaised) {
            return;
        }
        var diference = this.getHighestPersAmount() - this.getPersAmount(playerUid);
        if (diference > 0) {
            return {
                actions: ['CALL', 'RAISE', 'FOLD'],
                diference: diference
            };
        }
        return { actions: ['CHECK', 'BET'] };
    };
    Round.prototype.getHighestAmount = function () {
        return this.getActualStage().find(function (_a) {
            var highest = _a.highest;
            return highest;
        });
    };
    Round.prototype.checkIfHighestAmount = function (paramAmount) {
        var turn = this.getHighestAmount();
        if (!(turn === null || turn === void 0 ? void 0 : turn.highest) || !turn.amount)
            return false;
        return turn.amount > paramAmount;
    };
    Round.prototype.getActualStage = function () {
        if (this.stages.length == 1)
            return this.stages[0];
        if (this.stages.length == 2)
            return this.stages[1];
        if (this.stages.length == 3)
            return this.stages[2];
        if (this.stages.length == 4)
            return this.stages[3];
        return this.stages[4];
    };
    Round.prototype.getActualStageName = function () {
        if (this.stages.length == 1)
            return 'preflop';
        if (this.stages.length == 2)
            return 'flop';
        if (this.stages.length == 3)
            return 'turn';
        if (this.stages.length == 4)
            return 'river';
        return 'finish';
    };
    Round.prototype.setNewStage = function () {
        this.stages.push([]);
    };
    Round.prototype.groupByUid = function () {
        return this.getActualStage().reduce(function (grouped, turn) {
            var finded = grouped.findIndex(function (_a) {
                var playerUid = _a.playerUid;
                return playerUid == turn.playerUid;
            });
            finded != -1
                ? grouped[finded].turns.push(turn)
                : grouped.push({ turns: [turn], playerUid: turn.playerUid });
            return grouped;
        }, []);
    };
    Round.prototype.getPersAmount = function (playerUidToFind) {
        var _a, _b;
        var groupedTurns = this.groupByUid();
        return (_b = (_a = groupedTurns.find(function (_a) {
            var playerUid = _a.playerUid;
            return playerUid == playerUidToFind;
        })) === null || _a === void 0 ? void 0 : _a.turns.reduce(function (total, _a) {
            var amount = _a.amount;
            if (!amount)
                return total;
            return Number(total) + Number(amount);
        }, 0)) !== null && _b !== void 0 ? _b : 0;
    };
    Round.prototype.getHighestPersAmount = function () {
        var _this = this;
        var groupedTurns = this.groupByUid();
        return groupedTurns.reduce(function (highest, _a) {
            var playerUid = _a.playerUid;
            var totalAmount = _this.getPersAmount(playerUid);
            return totalAmount > highest
                ? totalAmount
                : highest;
        }, 0);
    };
    Round.prototype.getStageCards = function () {
        var cards = this.roundDeck.slice(-5);
        switch (this.getActualStageName()) {
            case 'flop':
                return cards.slice(0, 3);
            case 'turn':
                return cards.slice(3, 4);
            case 'river':
                return cards.slice(-1);
        }
    };
    Round.prototype.getLowerPlayerBalance = function () {
        return this.players.reduce(function (lower, player) {
            var _a, _b;
            var lowerBalance = (_a = lower.balance) !== null && _a !== void 0 ? _a : 0;
            var currentBalance = (_b = player.balance) !== null && _b !== void 0 ? _b : 0;
            if (currentBalance < lowerBalance)
                return player;
            return lower;
        });
    };
    Round.prototype.getWinner = function () {
        var commonCards = this.roundDeck.slice(-5);
        var combinations = this.players.map(function (player) {
            var _a;
            return ({
                player: player.uid,
                combination: deck_1["default"].getCombinationValue((_a = player.cards) === null || _a === void 0 ? void 0 : _a.concat(commonCards))
            });
        });
        var winners = combinations.reduce(function (winner, combination) {
            var _a;
            if (winner[0].player == combination.player)
                return winner;
            if (winner[0].combination.herarchy < combination.combination.herarchy)
                return winner;
            if (winner[0].combination.herarchy > combination.combination.herarchy)
                return [combination];
            var winnerHighCardsCopy = __spreadArray([], winner[0].combination.highCardValues, true);
            for (var _i = 0, _b = combination.combination.highCardValues; _i < _b.length; _i++) {
                var value = _b[_i];
                var winnerValue = (_a = winnerHighCardsCopy === null || winnerHighCardsCopy === void 0 ? void 0 : winnerHighCardsCopy.shift()) !== null && _a !== void 0 ? _a : -1;
                if (winnerValue > value)
                    return winner;
                if (winnerValue < value)
                    return [combination];
            }
            winner.push(combination);
            return winner;
        }, [combinations[0]])
            .map(function (e) { return e === null || e === void 0 ? void 0 : e.player; });
        return {
            winners: winners,
            combinations: combinations
        };
    };
    return Round;
}());
exports["default"] = Round;
