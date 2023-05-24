import Lobby from '../interfaces/lobby.interface';
import WsClient from '../interfaces/wsClient.interface';
declare const onConnect: (uid: string, wsClient: WsClient) => void;
/**
 * This method is used to create a lobby and add it to the lobbies array, it also notifies the user that it has been created.
 * @param lobbies
 * @param wsClient
 * @param reward
 */
declare const onCreate: (lobbies: Lobby[], wsClient: WsClient, reward: number) => void;
/**
 * This method is used to join to a lobby by the lobby id, it also notifies the entire lobby of a user joined.
 * @param lobbies
 * @param wsClient
 * @param gidParam
 */
declare const onJoin: (lobbies: Lobby[], wsClient: WsClient, gidParam: string) => void;
declare const onStart: (lobby: Lobby) => Promise<void>;
declare const onDefault: (wsClient: WsClient) => void;
declare const onExit: (wsClient: WsClient, lobbies: Lobby[], lobby: Lobby) => void;
export { onConnect, onCreate, onJoin, onStart, onDefault, onExit };
