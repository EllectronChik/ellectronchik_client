import { gql } from "@apollo/client";

export const loginMutation = gql`
  mutation Login($name: String!, $password: String!) {
    login(loginUserInput: { name: $name, password: $password })
  }
`;
