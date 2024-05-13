import decryptText from "@/actions/decryptText";
import DiaryList from "@/components/DiaryList/DiaryList";
import { getClient } from "@/lib/graphql/client";
import { IDiaryNote } from "@/models/IDiaryNote";
import { gql } from "@apollo/client";
import { cookies } from "next/headers";
import classes from "./diary.module.scss";
import ITag from "@/models/ITag";

interface IDiaryData {
  findUserNotesPaginated: IDiaryNote[];
  findTagsByUser: ITag[];
}

const Diary = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const NOTES_QUERY = gql`
    query FindUserNotesPaginated(
      $page: Float
      $limit: Float
      $direction: Float
    ) {
      findUserNotesPaginated(
        page: $page
        limit: $limit
        direction: $direction
      ) {
        _id
        encryptedTitle
        encryptedText
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

  const page = Number.isNaN(parseInt(searchParams?.page || "1", 10))
    ? 1
    : parseInt(searchParams?.page || "1", 10);
  const limit = Number.isNaN(parseInt(searchParams?.limit || "10", 10))
    ? 10
    : parseInt(searchParams?.limit || "10", 10);
  const direction = searchParams?.direction === "-1" ? -1 : 1;

  const { data, error } = await getClient()
    .query<IDiaryData>({
      query: NOTES_QUERY,
      variables: {
        page,
        limit,
        direction,
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
      if (!res.data?.findUserNotesPaginated) {
        return { data: res.data, error: res.error };
      }
      const decryptedNotes: IDiaryNote[] = await Promise.all(
        res.data?.findUserNotesPaginated?.map(async (note) => {
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
            encryptedText: decryptedData.text.slice(0, 250),
          };

          return decryptedNote;
        })
      );
      const responseData: IDiaryData = {
        findUserNotesPaginated: decryptedNotes,
        findTagsByUser: res.data?.findTagsByUser || [],
      };
      return { data: responseData, error: res.error };
    });

  if (error) {
    return <div>{error.message}</div>;
  }

  return (
    <div className={classes.container}>
      <DiaryList
        notes={data?.findUserNotesPaginated || []}
        tags={data?.findTagsByUser || []}
      />
    </div>
  );
};

export default Diary;
