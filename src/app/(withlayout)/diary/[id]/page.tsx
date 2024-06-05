import decryptText from "@/actions/decryptText";
import Tag from "@/components/Tag/Tag";
import { getClient } from "@/lib/graphql/client";
import { gql } from "@apollo/client";
import { cookies } from "next/headers";
import classes from "./diaryNote.module.scss";
import CreateNote from "@/assets/images/create-note.svg";
import Image from "next/image";
import Link from "next/link";
import DeleteDiaryItem from "@/components/DeleteDiaryItem/DeleteDiaryItem";
import { Metadata } from "next";
import LoadImage from "@/components/LoadImage/loadImage";

interface IDiaryData {
  findNoteById: {
    encryptedTitle: string;
    encryptedText: string;
    diaryNoteMedia: { mediaPath: string; mediaIVHex: string }[];
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

const fetchData = async (id: string) => {
  const noteQuery = gql`
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
  const { data, loading, errors } = await getClient()
    .query<IDiaryData, IVariables>({
      query: noteQuery,
      variables: {
        id: id,
      },
      errorPolicy: "all",
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
      try {
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
          errors: res.errors,
        };
      } catch (error) {
        return {
          data: null,
          loading: res.loading,
          errors: res.errors,
        };
      }
    });
  return {
    data: data,
    loading: loading,
    errors: errors,
  };
};

export const generateMetadata = async (props: {
  params: { id: string };
}): Promise<Metadata> => {
  const { data } = await fetchData(props.params.id);
  return {
    title: data?.findNotesById.title,
    description: `Page with diary note: ${data?.findNotesById.title}`,
  };
};

const DiaryNote = async ({ params }: { params: { id: string } }) => {
  const { data, errors } = await fetchData(params.id);

  return (
    <>
      {errors && (
        <div className={classes.container}>
          <p className={classes.error}>
            {errors.map((error) => error.message)}
          </p>
        </div>
      )}
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
                {data.findNotesById.updatedAt && (
                  <p className={classes.date}>
                    Updated at:{" "}
                    {new Date(data.findNotesById.updatedAt).toLocaleString()}
                  </p>
                )}
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
            <div className={classes.contantContainer}>
              <p>{data.findNotesById.text}</p>
              {data.findNotesById.diaryNoteMedia.length > 0 && (
                <div className={classes.images}>
                  {data.findNotesById.diaryNoteMedia.map((media) => <LoadImage key={media.mediaIVHex} media={media} className={classes.image} />)}
                </div>
              )}
            </div>
            <div className={classes.actions}>
              <Link
                href={`/diary/update/${params.id}`}
                className={classes.link}
              >
                <Image
                  src={CreateNote}
                  alt="create-note"
                  className={classes.createNote}
                />
              </Link>
              <DeleteDiaryItem id={params.id} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DiaryNote;
