import { gql } from "@apollo/client";

export const commonGameDataSubscription = gql`
  subscription CommonGameData($gameId: String!) {
    commonData(gameId: $gameId) {
      gameExist
      gameRunning
      chat {
        username
        message
      }
      guesses
      players {
        id
        name
        avatarId
        score
        wins
        isGuessed
        isDrawing
        isKing
      }
    }
  }
`;
