import { gql } from "@apollo/client";

export const getGamesSubscription = gql`
  subscription GetGames {
    getGames {
      id
      language
      package
      playersCount
      pointsToWin
    }
  }
`;
