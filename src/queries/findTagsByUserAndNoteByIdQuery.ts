import { gql } from "@apollo/client";

export const findTagsByUserAndNoteByIdQuery = gql`
  query FindTagsByUserAndNoteById($id: String!) {
    findTagsByUser {
      _id
      name
      color
    }
    findNoteById(id: $id) {
      encryptedTitle
      encryptedText
      diaryNoteMedia {
        mediaPath
        mediaIVHex
      }
      tags
      iv
      _id
    }
  }
`;
