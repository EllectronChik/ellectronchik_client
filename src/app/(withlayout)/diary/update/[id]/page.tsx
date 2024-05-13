import { getClient } from "@/lib/graphql/client";
import classes from "./updatenote.module.scss";
import { gql } from "@apollo/client";
import { cookies } from "next/headers";
import ITag from "@/models/ITag";
import CreateNoteCard from "@/components/CreateNoteCard/CreateNoteCard";
import { IDiaryNote } from "@/models/IDiaryNote";
import decryptText from "@/actions/decryptText";
import { IDiaryNoteDecrypted } from "@/models/IDiaryNoteDecrypted";

interface IDiaryData {
  findTagsByUser: ITag[];
  findNoteById: IDiaryNote;
}

const UpdateNote = async ({ params }: { params: { id: string } }) => {
  const GET_TAGS = gql`
    query FindTagsByUser($id: String!) {
      findTagsByUser {
        _id
        name
        color
      }
      findNoteById(id: $id) {
        encryptedTitle
        encryptedText
        encryptedMedia
        tags
        iv
        _id
      }
    }
  `;

  const {
    data: tags,
    loading,
    error,
  } = await getClient()
    .query<IDiaryData>({
      query: GET_TAGS,
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
      errorPolicy: "all",
    })
    .then(async (res) => {
      const decrypted = await decryptText(
        res.data.findNoteById.encryptedTitle,
        res.data.findNoteById.encryptedText,
        res.data.findNoteById.iv
      );
      const findNoteById: IDiaryNoteDecrypted = {
        ...res.data.findNoteById,
        ...decrypted,
      };
      return {
        ...res,
        data: {
          ...res.data,
          findNoteById: { ...res.data.findNoteById, ...decrypted },
        },
      };
    });

  return (
    <div className={classes.container}>
      {tags && (
        <CreateNoteCard tags={tags.findTagsByUser} note={tags.findNoteById} />
      )}
      {loading && <div>Loading</div>}
      {error && <div>Error</div>}
    </div>
  );
};

export default UpdateNote;
