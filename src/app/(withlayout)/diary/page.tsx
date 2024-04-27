import { getClient } from "@/lib/graphql/client";
import { gql } from "@apollo/client";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const Diary = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {

  const GQL = gql`
  query FindUserNotesPaginated($page: Int, $limit: Int) {
    findUserNotesPaginated(page: $page, limit: $limit) {
        encryptedTitle
        encryptedText
        createdAt
        updatedAt
        tags
    }
}
`
  if (!cookies().get("refresh-token")?.value) {
    redirect("/login");
  }

  const page = Number.isNaN(parseInt(searchParams?.page || "1", 10))
    ? 1
    : parseInt(searchParams?.page || "1", 10);
  const limit = Number.isNaN(parseInt(searchParams?.limit || "10", 10))
    ? 10
    : parseInt(searchParams?.limit || "10", 10);



  const { data, error } = await getClient().query({
    query: GQL,
    variables: {
      page,
      limit
    },
    context: {
      headers: {
        "cookie": searchParams?.cookie || "",
      },
    },
    errorPolicy: "all",
  });

  if (error) {
    console.error(error);
    return null;
  }

  return <div></div>;
};

export default Diary;
