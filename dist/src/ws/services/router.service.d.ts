import WsClient from "../interfaces/wsClient.interface";
declare const lobbyMsg: (wsClients: WsClient[], status: string, msg?: object) => void;
declare const clientMsg: (wsClient: WsClient, status: string, msg?: object) => void;
export { lobbyMsg, clientMsg };
