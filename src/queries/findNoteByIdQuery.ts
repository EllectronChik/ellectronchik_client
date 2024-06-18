import { gql } from "@apollo/client";

export const findNoteByIdQuery = gql`
  query FindNoteById($id: String!) {
    findNoteById(id: $id) {
      encryptedTitle
      encryptedText
      diaryNoteMedia {
        mediaPath
        mediaIVHex
      }
      createdAt
      updatedAt
      tags
      iv
      userId
    }
    findTagsByUser {
      _id
      name
      color
    }
  }
`;
