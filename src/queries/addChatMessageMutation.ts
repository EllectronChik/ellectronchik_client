import { gql } from "@apollo/client";

export const addChatMessageMutation = gql`
  mutation AddChatMessage($gameId: String!, $message: String!, $playerId: String!) {
    addChatMessage(
      addChatMessageInput: {
        gameId: $gameId
        message: $message
        playerId: $playerId
      }
    )
  }
`;
