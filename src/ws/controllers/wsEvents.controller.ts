import Lobby from '../interfaces/lobby.interface'
import WsClient from '../interfaces/wsClient.interface'
import gidGenerator from '../utils/generateGid'
import { clientMsg, lobbyMsg } from '../services/router.service'
import getWsClientsUids from '../utils/getWsClientsUid'
import Game from '../models/game'
import { startingRound } from './game.controller'
import { getUser, updateUser } from '../../rest/services/users.service'

const onConnect = (uid: string, wsClient: WsClient) => {
    wsClient.uid = uid
    clientMsg(wsClient, 'CONNECTED', { client: uid })
}

/**
 * This method is used to create a lobby and add it to the lobbies array, it also notifies the user that it has been created.
 * @param lobbies 
 * @param wsClient 
 * @param reward 
 */
const onCreate = (lobbies: Lobby[], wsClient: WsClient, reward: number) => {
    const gid = gidGenerator()
    lobbies.push({ gid, wsClients: [wsClient], reward})
    wsClient.gid = gid
    clientMsg(wsClient, 'CREATED', { lobby: gid })
}

/**
 * This method is used to join to a lobby by the lobby id, it also notifies the entire lobby of a user joined.
 * @param lobbies 
 * @param wsClient 
 * @param gidParam 
 */
const onJoin = (lobbies: Lobby[], wsClient: WsClient, gidParam: string) => {
    const lobby = lobbies.find(({ gid }) => gid == gidParam)
    if (lobby == undefined) {
        clientMsg(wsClient, 'LOBBY_NOT_FOUND', {
            gid: gidParam
        })
        return
    }
    const { gid, wsClients } = lobby
    wsClient.gid = gid
    wsClients.push(wsClient)
    const wsClientsUids = getWsClientsUids(wsClients)
    const { uid } = wsClient 
    lobbyMsg(wsClients, 'JOINED', {
        clients: wsClientsUids,
        client: uid,
    })
}

const onStart = async (lobby: Lobby) => {
    const { wsClients } = lobby
    if (lobby.game) {
        if (lobby.game.getLastRound().getActualStageName() != 'finish') return
        lobby.game.setNewRound()
    }
    const responses = await Promise.allSettled(wsClients.map(wsClient => getUser(wsClient.uid)))
    const validUsers: {client: WsClient, uid: string, options: {coin_balance: number}}[] = []
    for (const res of responses) {
        if (res.status == 'rejected') continue
        if (!res.value.ok) {
            continue
        }
        const wsClient = wsClients.find(({ uid }) => res.value.ok && uid == res.value.data.id)
        if (wsClient == undefined) continue
        if (lobby.reward > Number(res.value.data?.coin_balance)) {
            clientMsg(wsClient, 'NOT_ENOUGH_COINS', {
                error: "You don't have enough coins to start the game",
                coin_balance: res.value.data.coin_balance,
                reward: lobby.reward
            })
            const userId = wsClients.findIndex(({ uid }) => uid == wsClient.uid)
            wsClients.splice(userId, 1)
            wsClient.close()
        } else {
            validUsers.push({client: wsClient, uid: wsClient.uid, options: { coin_balance: Number(res.value.data?.coin_balance) - lobby.reward }})
        }
    }
    const invalidUsers = wsClients.filter(wsClient => !validUsers.map(e => e.client).includes(wsClient))
    for (const wsClient of invalidUsers) {
        wsClient.close()
        const userId = wsClients.findIndex(({ uid }) => uid == wsClient.uid)
        wsClients.splice(userId, 1)
    }
    if (wsClients.length < 2) {
        clientMsg(wsClients[0], 'NOT_ENOUGH_PLAYERS', {
            error: "You need at least 2 players to start the game"
        })
        return
    }
    for (const { client, uid, options } of validUsers) {
        const res = await updateUser(uid, options)
        if (!res.ok) {
            clientMsg(client, 'ERROR', {
                error: "An error has ocurred while updating the user"
            })
            
        }
    }
    lobbyMsg(wsClients, 'STARTED')
    lobby.game = new Game(wsClients, lobby.reward)
    startingRound(lobby.game)
}

const onDefault = (wsClient: WsClient) => {
    clientMsg(wsClient, 'NOT_FOUND', {
        error: "menu atribute not found or menu value is undefined"
    })
}

const onExit = (wsClient: WsClient, lobbies: Lobby[], lobby: Lobby) => {
    const { wsClients } = lobby
    const wsClientI = wsClients.findIndex(({ uid }) => uid == wsClient.uid)
    if (wsClientI == -1) return
    const { uid: client } = wsClients[wsClientI]
    wsClients.splice(wsClientI, 1)
    if (wsClients.length == 0) {
        lobbies.splice(lobbies.indexOf(lobby), 1)
        return
    }
    const wsClientsUids = getWsClientsUids(wsClients)
    lobbyMsg(wsClients, 'EXITED', { clients: wsClientsUids, client })
}

export { onConnect, onCreate, onJoin, onStart, onDefault, onExit }