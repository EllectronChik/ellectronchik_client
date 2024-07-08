"use client";

import { IGetGamesSubscriptionResp } from "@/models/IGetGamesSubscriptionResp";
import { getGamesSubscription } from "@/queries/getGamesSubscription";
import { useSubscription } from "@apollo/client";
import classes from "./ExistingGames.module.scss";
import { FC, HTMLProps, MouseEvent } from "react";
import GameInfo from "../GameInfo/GameInfo";
import { useRouter } from "next/navigation";
import Link from "next/link";
import getCookie from "@/lib/client/getCookie";
import setCookie from "@/lib/client/setCookie";

interface IProps extends HTMLProps<HTMLDivElement> {
  savePack: boolean;
  isCustomWordlist: boolean;
  playerName: string;
  playerAvatarId: number;
}

const ExistingGame: FC<IProps> = ({ savePack, isCustomWordlist, playerName, playerAvatarId, ...props }) => {
  const { data, loading, error } =
    useSubscription<IGetGamesSubscriptionResp>(getGamesSubscription);

  const router = useRouter();

  const handleSelectGame = (e: MouseEvent<HTMLAnchorElement, globalThis.MouseEvent>, id: string) => {
    e.preventDefault();
    const savedPlayerName = getCookie("playerName");
    const savedPlayerAvatarId = getCookie("playerAvatarId");
    
    if (!savedPlayerName) {
      setCookie("playerName", playerName, 1000 * 24 * 60 * 60 * 31);
    }

    if (!savedPlayerAvatarId) {
      setCookie("playerAvatarId", playerAvatarId.toString(), 1000 * 24 * 60 * 60 * 31);
    }
    router.push(`/drawit/${id}`);
  };

  return (
    <div
      className={`${classes.container}${
        isCustomWordlist ? ` ${classes.expanded}` : ""
      }${savePack ? ` ${classes.extraExpanded}` : ""}${
        props.className ? ` ${props.className}` : ""
      }`}
    >
      <h3 className={classes.title}>Join an existing game</h3>
      {!data?.getGames?.length && !loading && !error && (
        <p className={classes.noGames}>No games</p>
      )}
      {loading && <p className={classes.noGames}>Loading...</p>}
      {error && <p className={classes.noGames}>Error</p>}
      {data && (
        <div className={classes.games}>
          {data?.getGames?.map((game) => (
            <Link
              className={classes.game}
              key={game.id}
              href={`/drawit/${game.id}`}
              onClick={(e) => handleSelectGame(e, game.id)}
            >
              <GameInfo
              game={game}
            /></Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExistingGame;
