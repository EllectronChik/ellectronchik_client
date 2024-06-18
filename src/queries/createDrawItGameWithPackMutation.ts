import { gql } from "@apollo/client";

export const createWithPackGqlMutation = gql`
  mutation StartGameWithPack(
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
    $packTitle: String!
    $packLanguage: String!
    $packWordList: [String!]!
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
    createDrawItPack(
      createDrawitInput: {
        title: $packTitle
        language: $packLanguage
        wordList: $packWordList
      }
    ) {
      id
    }
  }
`;
