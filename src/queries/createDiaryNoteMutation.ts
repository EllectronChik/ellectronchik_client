import { gql } from "@apollo/client";

export const createDiaryNoteMutation = gql`
  mutation CreateDiaryNote(
    $encryptedTitle: String!
    $encryptedText: String!
    $tags: [String!]
    $iv: String!
  ) {
    createDiaryNote(
      createNoteInput: {
        encryptedTitle: $encryptedTitle
        encryptedText: $encryptedText
        tags: $tags
        iv: $iv
      }
    ) {
      _id
      iv
    }
  }
`;
