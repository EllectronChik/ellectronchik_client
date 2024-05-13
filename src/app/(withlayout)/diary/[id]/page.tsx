import decryptText from "@/actions/decryptText";
import Tag from "@/components/Tag/Tag";
import { getClient } from "@/lib/graphql/client";
import { gql } from "@apollo/client";
import { cookies } from "next/headers";
import classes from "./diaryNote.module.scss";
import CreateNote from "@/assets/images/create-note.svg";
import Image from "next/image";
import Link from "next/link";

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
  findTagsByUser: {
    _id: string;
    name: string;
    color: string;
  }[];
}

interface IVariables {
  id: string;
}

const DiaryNote = async ({ params }: { params: { id: string } }) => {
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
      findTagsByUser {
        _id
        name
        color
      }
    }
  `;

  const { data, error } = await getClient()
    .query<IDiaryData, IVariables>({
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
    })
    .then(async (res) => {
      const decrypted = await decryptText(
        res.data?.findNoteById.encryptedTitle,
        res.data?.findNoteById.encryptedText,
        res.data?.findNoteById.iv
      );
      return {
        data: {
          findNotesById: {
            ...res.data?.findNoteById,
            ...decrypted,
          },
          findTagsByUser: res.data?.findTagsByUser || [],
        },
        loading: res.loading,
        error: res.error,
      };
    });

  return (
    <>
      {error && <p>{error.message}</p>}
      {data && (
        <div className={classes.container}>
          <div className={classes.content}>
            <h2 className={classes.title}>{data.findNotesById.title}</h2>
            <div className={classes.header}>
              <div className={classes.dates}>
                <p className={classes.date}>
                  Created at:{" "}
                  {new Date(data.findNotesById.createdAt).toLocaleString()}
                </p>
                <p className={classes.date}>
                  Updated at:{" "}
                  {new Date(data.findNotesById.updatedAt).toLocaleString()}
                </p>
              </div>
              <div className={classes.tags}>
                {data.findNotesById.tags.map((tag) => {
                  const tagData = data.findTagsByUser.find(
                    (t) => t._id === tag
                  );
                  return (
                    <Tag
                      key={tag}
                      name={tagData?.name || ""}
                      color={tagData?.color || ""}
                    />
                  );
                })}
              </div>
            </div>
            <p className={classes.text}>{data.findNotesById.text}</p>
            <Link href={`/diary/update/${params.id}`} className={classes.link}>
              <Image
                src={CreateNote}
                alt="create-note"
                className={classes.createNote}
              />
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export default DiaryNote;
