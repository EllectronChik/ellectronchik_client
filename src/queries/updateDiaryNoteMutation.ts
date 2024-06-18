import { gql } from "@apollo/client";

export const updateDiaryNoteMutation = gql`
  mutation UpdateDiaryNote(
    $encryptedTitle: String
    $encryptedText: String
    $tags: [String!]
    $iv: String
    $id: String!
  ) {
    updateDiaryNote(
      updateNoteInput: {
        encryptedTitle: $encryptedTitle
        encryptedText: $encryptedText
        tags: $tags
        iv: $iv
        id: $id
      }
    ) {
      _id
      iv
    }
  }
`;
