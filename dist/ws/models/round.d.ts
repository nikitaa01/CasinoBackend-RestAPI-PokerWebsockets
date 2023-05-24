import Card from "../interfaces/card.interface";
import WsClient from "../interfaces/wsClient.interface";
import Turn from "./turn";
export default class Round {
    readonly stages: Turn[][];
    readonly roundDeck: Card[];
    players: WsClient[];
    amount: number;
    constructor(preflop: Turn[], players: WsClient[], initialAmount: number);
    getPotentialActions(playerUid: string, lastRaised: boolean): {
        actions: string[];
        diference: number;
    } | {
        actions: string[];
        diference?: undefined;
    } | undefined;
    getHighestAmount(): Turn | undefined;
    checkIfHighestAmount(paramAmount: number): boolean;
    getActualStage(): Turn[];
    getActualStageName(): "preflop" | "flop" | "turn" | "river" | "finish";
    setNewStage(): void;
    groupByUid(): {
        turns: Turn[];
        playerUid: string;
    }[];
    getPersAmount(playerUidToFind: string): number;
    getHighestPersAmount(): number;
    getStageCards(): Card[] | undefined;
    getLowerPlayerBalance(): WsClient;
    getWinner(): {
        winners: string[];
        combinations: {
            player: string;
            combination: import("../interfaces/combination.interface").default;
        }[];
    };
}
