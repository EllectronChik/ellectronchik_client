import { getClient } from "@/lib/graphql/client";
import classes from "./updatenote.module.scss";
import { cookies } from "next/headers";
import ITag from "@/models/ITag";
import CreateNoteCard from "@/components/CreateNoteCard/CreateNoteCard";
import { IDiaryNote } from "@/models/IDiaryNote";
import decryptText from "@/actions/decryptText";
import { IDiaryNoteDecrypted } from "@/models/IDiaryNoteDecrypted";
import { Metadata } from "next";
import { findTagsByUserAndNoteByIdQuery } from "@/queries/findTagsByUserAndNoteByIdQuery";

interface IDiaryData {
  findTagsByUser: ITag[];
  findNoteById: IDiaryNote;
}

const fetchData = async (id: string) => {
  const {
    data: tags,
    errors,
    loading,
  } = await getClient()
    .query<IDiaryData>({
      query: findTagsByUserAndNoteByIdQuery,
      variables: {
        id: id,
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
      try {
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
            findNoteById,
          },
        };
      } catch (error) {
        return {
          ...res,
          data: null,
        };
      }
    });

  return {
    tags,
    errors,
    loading,
  };
};

export const generateMetadata = async (props: {
  params: { id: string };
}): Promise<Metadata> => {
  const { tags, errors } = await fetchData(props.params.id);

  if (errors) {
    return {
      title: "Error",
      description: "Error",
    };
  }
  return {
    title: `Update Note - ${tags?.findNoteById.title || ""}`,
    description: `Page with ${
      tags?.findNoteById.title || ""
    } diary note update`,
  };
};

const UpdateNote = async ({ params }: { params: { id: string } }) => {
  const { tags, errors, loading } = await fetchData(params.id);

  return (
    <div className={classes.container}>
      {tags && (
        <CreateNoteCard tags={tags.findTagsByUser} note={tags.findNoteById} />
      )}
      {loading && <div>Loading</div>}
      {errors && <div>Note not found</div>}
    </div>
  );
};

export default UpdateNote;
