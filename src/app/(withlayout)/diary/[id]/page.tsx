import { getClient } from "@/lib/graphql/client";
import { gql } from "@apollo/client";
import { cookies } from "next/headers";

interface IDiaryData {
  findNoteById: {
    encryptedTitle: string;
    encryptedText: string;
    encryptedMedia: string;
    createdAt: string;
    updatedAt: string;
    tags: string[];
    iv: string;
    userId: string;
  };
}

interface IVariables {
  id: string;
}

const page = async ({ params }: { params: { id: string } }) => {
  const noteQuery = gql`
    query FindNoteById($id: String!) {
      findNoteById(id: $id) {
        encryptedTitle
        encryptedText
        encryptedMedia
        createdAt
        updatedAt
        tags
        iv
        userId
      }
    }
  `;

  const { data, loading, error } = await getClient().query<
    IDiaryData,
    IVariables
  >({
    query: noteQuery,
    variables: {
      id: params.id,
    },
    context: {
      headers: {
        cookie:
          cookies()
            .getAll()
            .map(({ name, value }) => `${name}=${value}`)
            .join(";") || "",
      },
    },
  });

  return (
    <>
      {error && <p>{error.message}</p>}
      {data && <div>
          {data.findNoteById.encryptedTitle}
        </div>}
    </>
  );
};

export default page;
