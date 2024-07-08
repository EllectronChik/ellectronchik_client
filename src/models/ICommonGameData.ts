import { IChatMessage } from "./IChatMessage";
import { IPlayer } from "./IPlayer";

export interface ICommonGameData {
  gameExist: boolean;
  gameRunning: boolean;
  players: IPlayer[];
  chat: IChatMessage[];
  guesses: IChatMessage[];  
}