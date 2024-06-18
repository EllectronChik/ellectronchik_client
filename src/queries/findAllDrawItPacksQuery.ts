import { gql } from "@apollo/client";

export const findAllDrawItPacksQuery = gql`
  query findAllDrawItPacks {
    findAllDrawItPacks {
      title
      language
      id
    }
  }
`;
