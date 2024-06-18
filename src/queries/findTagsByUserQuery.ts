import { gql } from "@apollo/client";

export const findTagsByUserQuery = gql`
  query FindTagsByUser {
    findTagsByUser {
      _id
      name
      color
    }
  }
`;
