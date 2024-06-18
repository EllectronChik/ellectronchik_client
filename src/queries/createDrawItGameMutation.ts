import { gql } from "@apollo/client";

export const createGqlMutation = gql`
  mutation StartGame(
    $playersCount: Int!
    $pointsToWin: Int!
    $oneGuessPoints: Int!
    $timeLimit: Int!
    $wordlistId: String
    $customWordlist: [String!]
    $KingPlayerId: String!
    $KingPlayerName: String!
    $KingPlayerAvatarId: Int!
    $isPrivate: Boolean!
  ) {
    startGame(
      startGameInput: {
        playersCount: $playersCount
        pointsToWin: $pointsToWin
        oneGuessPoints: $oneGuessPoints
        timeLimit: $timeLimit
        wordlistId: $wordlistId
        customWordlist: $customWordlist
        KingPlayer: {
          id: $KingPlayerId
          name: $KingPlayerName
          avatarId: $KingPlayerAvatarId
        }
        isPrivate: $isPrivate
      }
    ) {
      id
    }
  }
`;
