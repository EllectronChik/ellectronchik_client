import DrawItStart from "@/components/DrawItStart/DrawItStart";
import classes from "./drawit.module.scss";
import { getClient } from "@/lib/graphql/client";
import { ApolloError } from "@apollo/client";
import { IDrawItPack } from "@/models/IDrawItPack";
import { cookies } from "next/headers";
import { findAllDrawItPacksQuery } from "@/queries/findAllDrawItPacksQuery";

interface IData {
  findAllDrawItPacks: IDrawItPack[];
}

const DrawIt = async () => {
  const names = ["Гойдик", "КлёвоеИмя", "Абоба", "Рофлс"];
  const initialPlayerName =
    cookies().get("playerName")?.value ||
    `${names[Math.floor(Math.random() * names.length)]}#${Math.floor(
      Math.random() * 1000
    )}`;

  const initialPlayerAvatarId = parseInt(
    cookies().get("playerAvatarId")?.value || "0"
  );

  const { data, error } = await getClient()
    .query<IData>({
      query: findAllDrawItPacksQuery,
      errorPolicy: "all",
    })
    .then((res) => {
      return {
        data: res.data,
        error: null,
      };
    })
    .catch((err: ApolloError) => {
      console.log(err.networkError?.name);
      return {
        data: null,
        error: "Something went wrong, please try again later",
      };
    });

  return (
    <main className={classes.page}>
      {error && (
        <div className={classes.error}>
          <p>{error}</p>
        </div>
      )}
      {data && (
        <DrawItStart
          initialPlayerName={initialPlayerName}
          initialPlayerAvatarId={initialPlayerAvatarId}
          packs={data.findAllDrawItPacks}
        />
      )}
    </main>
  );
};

export default DrawIt;
