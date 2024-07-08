import { getClient } from "@/lib/graphql/client";
import classes from "./createnote.module.scss";
import { gql } from "@apollo/client";
import { cookies } from "next/headers";
import ITag from "@/models/ITag";
import CreateNoteCard from "@/components/CreateNoteCard/CreateNoteCard";
import { Metadata } from "next";
import { findTagsByUserQuery } from "@/queries/findTagsByUserQuery";

interface IDiaryData {
  findTagsByUser: ITag[];
}

export const metadata: Metadata = {
  title: "Create Note",
  description: "Create new diary note page",
};

const CreateNote = async () => {
  const {
    data: tags,
    loading,
    error,
  } = await getClient().query<IDiaryData>({
    query: findTagsByUserQuery,
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
  });

  return (
    <div className={classes.container}>
      {tags && <CreateNoteCard tags={tags.findTagsByUser} />}
      {loading && <div>Loading</div>}
      {error && <div>Error</div>}
    </div>
  );
};

export default CreateNote;
