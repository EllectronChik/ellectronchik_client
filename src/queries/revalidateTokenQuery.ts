import { gql } from "@apollo/client";

export const revalidateTokenQuery = gql`
  query {
    revalidateToken {
      accessToken
      refreshToken
    }
  }
`;
