import { gql } from "@apollo/client";

export const findUserNotesPaginatedQuery = gql`
  query FindUserNotesPaginated($page: Float, $limit: Float, $direction: Float) {
    findUserNotesPaginated(page: $page, limit: $limit, direction: $direction) {
      _id
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
    }
    findTagsByUser {
      _id
      name
      color
    }
  }
`;
