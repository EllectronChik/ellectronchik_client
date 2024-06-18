export interface ICreateGameVariables {
  playersCount: number;
  pointsToWin: number;
  oneGuessPoints: number;
  timeLimit: number;
  wordlistId: string | null;
  customWordlist: string[] | null;
  KingPlayerId: string;
  KingPlayerName: string;
  KingPlayerAvatarId: number;
  isPrivate: boolean;
}
