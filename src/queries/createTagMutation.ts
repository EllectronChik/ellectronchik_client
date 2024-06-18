import { gql } from "@apollo/client";

export const createTagMutation = gql`
  mutation CreateTag($name: String!, $color: String!) {
    createTag(createTagInput: { name: $name, color: $color }) {
      _id
      name
      color
    }
  }
`;
