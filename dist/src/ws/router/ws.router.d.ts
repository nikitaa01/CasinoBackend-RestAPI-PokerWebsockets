import Lobby from '../interfaces/lobby.interface';
import Msg from '../interfaces/msg.interface';
import WsClient from '../interfaces/wsClient.interface';
import Game from '../models/game';
/**
 * Forward the menu options, to create, join and etc...
 * @param msgParsed
 * @param wsClient
 * @param lobby
 */
declare const menu: (msgParsed: Msg, wsClient: WsClient, lobby: Lobby | undefined) => void;
declare const inGameMenu: (msgParsed: Msg, wsClient: WsClient, game: Game) => void;
/**
 * This method is used to forward incoming messages.
 * @param wsClient the user that triggers the events.
 */
declare const router: (wsClient: WsClient) => void;
export default router;
export { inGameMenu, menu };
