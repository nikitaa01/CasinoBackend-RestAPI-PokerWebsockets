import WsClient from "../interfaces/wsClient.interface";
import Round from "./round";
import Turn from "./turn";
export default class Game {
    activePlayers: WsClient[];
    rounds: Round[];
    readonly smallBlind: number;
    readonly bigBlind: number;
    constructor(activePlayers: WsClient[], reward: number);
    getNewRound(): Round;
    setNewRound(): void;
    resetLastRaised(): void;
    getLastRound(): Round;
    getTurnPong(turn: Turn): {
        wsClients: WsClient[];
        status: import("../types/turnAction").default;
        msg: {
            uid: string;
            amount: number | undefined;
        } | {
            uid: string;
            amount?: undefined;
        };
    } | undefined;
    getTurnPongQueue(): {
        wsClients: WsClient[];
        status: import("../types/turnAction").default;
        msg: {
            uid: string;
            amount: number | undefined;
        } | {
            uid: string;
            amount?: undefined;
        };
    }[] | undefined;
    getNextPlayerWarning(): {
        wsClient: WsClient;
        status: string;
        msg: {
            maxAmount: number;
            balance: number | undefined;
            actions: string[];
            diference: number;
        } | {
            maxAmount: number;
            balance: number | undefined;
            actions: string[];
            diference?: undefined;
        };
    } | undefined;
    getPersonalCards(): {
        wsClient: WsClient;
        status: string;
        cards: (import("../interfaces/card.interface").default | undefined)[];
    }[] | undefined;
    getTurnPlayer(players?: WsClient[], numTurns?: number): WsClient;
    checkIfGameEnd(): boolean;
}
