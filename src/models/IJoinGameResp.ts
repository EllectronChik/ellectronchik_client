import { IChatMessage } from "./IChatMessage";
import { IPlayer } from "./IPlayer";

export interface IJoinGameResp {
  joinGame: {
    chat: IChatMessage[];
    guesses: string[];
    players: IPlayer[];
    currentCanvasState: string;
    maxPlayersCount: number;
    pointsToWin: number;
  };
}
