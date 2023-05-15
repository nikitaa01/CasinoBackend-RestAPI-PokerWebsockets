"use strict";
exports.__esModule = true;
var Turn = /** @class */ (function () {
    function Turn(playerUid, action, amount) {
        this.playerUid = playerUid;
        this.action = action;
        this.sendedPong = false;
        if (amount)
            this.amount = amount;
    }
    Turn.prototype.getSelfMsg = function () {
        switch (this.action) {
            case 'CHECK':
                console.log('hola');
                break;
            case 'BET':
                console.log('hola');
                break;
            case 'CALL':
                console.log('hola');
                break;
            case 'RAISE':
                console.log('hola');
                break;
            case 'FOLD':
                console.log('hola');
                break;
        }
        return undefined;
    };
    Turn.prototype.getGroupMsg = function () {
        switch (this.action) {
            case 'CHECK':
                return {
                    uid: this.playerUid,
                    amount: this.amount
                };
            case 'BET':
                return {
                    uid: this.playerUid,
                    amount: this.amount
                };
            case 'CALL':
                return {
                    uid: this.playerUid,
                    amount: this.amount
                };
            case 'RAISE':
                return {
                    uid: this.playerUid,
                    amount: this.amount
                };
            case 'FOLD':
                return {
                    uid: this.playerUid
                };
        }
    };
    return Turn;
}());
exports["default"] = Turn;
