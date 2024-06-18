import { gql } from "@apollo/client";

export const registerMutation = gql`
  mutation Register($name: String!, $password: String!) {
    register(createUserInput: { name: $name, password: $password })
  }
`;
