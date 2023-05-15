"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clientMsg = exports.lobbyMsg = void 0;
/* FIXME: , null, 2 only in dev */
const sendMsg = (status, msg) => {
    return JSON.stringify(Object.assign({ status }, (Array.isArray(msg) ? { cards: msg } : msg)), null, 2);
};
/* FIXME: msg shoud have type */
const lobbyMsg = (wsClients, status, msg) => {
    try {
        for (const wsClient of wsClients) {
            wsClient.send(sendMsg(status, msg));
        }
    }
    catch (error) {
        console.log(error);
    }
};
exports.lobbyMsg = lobbyMsg;
const clientMsg = (wsClient, status, msg) => {
    try {
        wsClient.send(sendMsg(status, msg));
    }
    catch (error) {
        console.log(error);
    }
};
exports.clientMsg = clientMsg;
