"use server";

import { IDiaryNote } from "@/models/IDiaryNote";
import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
  gql,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { cookies } from "next/headers";
import decryptText from "./decryptText";

interface IDiaryData {
  findNotesByTitle: IDiaryNote[];
}

const httpLink = new HttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_CONNECTON,
});

const authLink = setContext((_, { headers }) => {
  const cookie = headers.cookie;

  return {
    headers: {
      ...headers,
      cookie: cookie ? cookie : "",
    },
  };
});

const client = new ApolloClient({
  link: ApolloLink.from([authLink, httpLink]),
  cache: new InMemoryCache(),
  credentials: "include",
});

const query = gql`
  query FindNotesByTitle($decryptedTitle: String!) {
    findNotesByTitle(title: $decryptedTitle) {
      _id
      encryptedTitle
      encryptedText
      createdAt
      updatedAt
      tags
      iv
    }
  }
`;

export default async function filterDiaryByTitle(title: string) {
  const { data, error } = await client
    .query<IDiaryData>({
      query,
      variables: {
        decryptedTitle: title,
      },
      context: {
        headers: {
          cookie: cookies()
            .getAll()
            .map((c) => `${c.name}=${c.value}`)
            .join(";"),
        },
      },
      errorPolicy: "all",
      fetchPolicy: "cache-first",
    })
    .then(async (res) => {
      const decryptedNotes: IDiaryNote[] = await Promise.all(
        res.data?.findNotesByTitle?.map(async (note) => {
          let decryptedData;
          try {
            decryptedData = await decryptText(
              note.encryptedTitle,
              note.encryptedText,
              note.iv
            );
          } catch (error) {
            console.error(error);
            return note;
          }
          const decryptedNote: IDiaryNote = {
            ...note,
            encryptedTitle: decryptedData.title,
            encryptedText: decryptedData.text,
          };

          return decryptedNote;
        })
      );
      return { ...res, data: { findNotesByTitle: decryptedNotes } };
    });
  if (error) {
    return null;
  }
  return data.findNotesByTitle;
}
