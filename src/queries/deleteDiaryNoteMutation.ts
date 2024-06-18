import { gql } from "@apollo/client";

export const deleteDiaryNoteMutation = gql`
  mutation DeleteDiaryNote($id: String!) {
    deleteDiaryNote(id: $id) {
      _id
    }
  }
`;
