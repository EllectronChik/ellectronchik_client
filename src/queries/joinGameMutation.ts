import { gql } from "@apollo/client";

export const JoinGameMutation = gql`
  mutation JoinGame(
    $gameId: String!
    $playerId: String!
    $playerAvatar: Int!
    $playerName: String!
  ) {
    joinGame(
      joinGameInput: {
        gameId: $gameId
        playerId: $playerId
        playerAvatar: $playerAvatar
        playerName: $playerName
      }
    ) {
      chat {
        username
        message
      }
      guesses
      currentCanvasState
      players {
        name
        avatarId
        score
        wins
        isGuessed
        isDrawing
        isKing
      }
      maxPlayersCount
      pointsToWin
    }
  }
`;
