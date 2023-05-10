/* import { describe, it, expect } from 'vitest'
import Game from '../src/ws/models/game'
import WsClient from '../src/ws/interfaces/wsClient.interface'
import { menu } from '../src/ws/router/ws.router'
import Lobby from '../src/ws/interfaces/lobby.interface'

describe('Game', () => {
    const send = (...any: any) => {
        return undefined
    }
    const close = (id: any, lobby: Lobby) => {
        let i = lobby.wsClients.findIndex(client => client.uid === id)
        lobby.wsClients.splice(i, 1)
        i = lobby.game?.activePlayers.findIndex(player => player.uid === id) as number
        lobby.game?.activePlayers.splice(i, 1)
    }
    const lobby: Lobby = {
        gid: '1',
        wsClients: [{ uid: '1', balance: 1000, send } as WsClient, { uid: '2', balance: 1000, send } as WsClient, { uid: '3', balance: 1000, send } as WsClient],
        reward: 1000,
    } as Lobby
    menu({ menu: 'START' }, lobby.wsClients[0], lobby)
    const game = lobby.game as Game

    lobby.wsClients = lobby.wsClients.map(client => {
        client.close = () => close(client.uid, lobby)
        return client
    })

    it('lobby should have an game', () => {
        expect(game).toBeDefined()
    })

    it('after 1 player fold game.players array\'s length should be 2 and lobby\'s should be 3', () => {
        menu({ menu: 'IN_GAME', turnAction: 'FOLD' }, game.getTurnPlayer(), lobby)
        expect(game.activePlayers.length).toBe(2)
        expect(lobby.wsClients.length).toBe(3)
    })
    
    it('should be stage river', () => {
        while (game.getLastRound().getActualStageName() != 'finish') {
            const getAction = game.getNextPlayerWarning()?.msg.actions
            menu({ menu: 'IN_GAME', turnAction: getAction?.includes('CHECK') ? 'CHECK' : 'CALL' }, game.getTurnPlayer(), lobby)
        }
        expect(game.getLastRound().getActualStageName()).toBe('finish')
    })

    menu({menu: 'START'}, lobby.wsClients[0], lobby)

    it('should be an')
}) */