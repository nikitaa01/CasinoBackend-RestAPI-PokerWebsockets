import WsClient from "../interfaces/wsClient.interface"

/* FIXME: , null, 2 only in dev */
const sendMsg = (status: string, msg?: object) => {
    return JSON.stringify({
        status,
        ...(Array.isArray(msg) ? { cards: msg } : msg),
    }, null, 2)
}

/* FIXME: msg shoud have type */
const lobbyMsg = (wsClients: WsClient[], status: string, msg?: object) => {
    try {
        for (const wsClient of wsClients) {
            wsClient.send(sendMsg(status, msg))
        }
    } catch (error) {
        console.log(error)
    }
}

const clientMsg = (wsClient: WsClient, status: string, msg?: object) => {
    try {
        wsClient.send(sendMsg(status, msg))
    } catch (error) {
        console.log(error)
    }
}

export { lobbyMsg, clientMsg }