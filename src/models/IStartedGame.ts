export interface IGame {
  id: string;
  language: string;
  package: string;
  playersCount: number;
  maxPlayersCount: number;
  pointsToWin: number;
}