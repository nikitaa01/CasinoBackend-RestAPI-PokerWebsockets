import turnAction from "../types/turnAction";
export default class Turn {
    readonly playerUid: string;
    readonly action: turnAction;
    readonly amount?: number;
    highest?: boolean;
    sendedPong: boolean;
    constructor(playerUid: string, action: turnAction, amount?: number);
    getSelfMsg(): undefined;
    getGroupMsg(): {
        uid: string;
        amount: number | undefined;
    } | {
        uid: string;
        amount?: undefined;
    };
}
