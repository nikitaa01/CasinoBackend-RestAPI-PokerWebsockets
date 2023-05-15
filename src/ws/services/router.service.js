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
exports.clientMsg = exports.lobbyMsg = void 0;
/* FIXME: , null, 2 only in dev */
var sendMsg = function (status, msg) {
    return JSON.stringify(__assign({ status: status }, (Array.isArray(msg) ? { cards: msg } : msg)), null, 2);
};
/* FIXME: msg shoud have type */
var lobbyMsg = function (wsClients, status, msg) {
    try {
        for (var _i = 0, wsClients_1 = wsClients; _i < wsClients_1.length; _i++) {
            var wsClient = wsClients_1[_i];
            wsClient.send(sendMsg(status, msg));
        }
    }
    catch (error) {
        console.log(error);
    }
};
exports.lobbyMsg = lobbyMsg;
var clientMsg = function (wsClient, status, msg) {
    try {
        wsClient.send(sendMsg(status, msg));
    }
    catch (error) {
        console.log(error);
    }
};
exports.clientMsg = clientMsg;
