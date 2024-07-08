import { gql } from "@apollo/client";

export const isGameExistQuery = gql`
  query IsGameExist($gameId: String!) {
    isGameExist(gameId: $gameId)
  }
`;
