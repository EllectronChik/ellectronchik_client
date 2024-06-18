"use client";

import { IGetGamesSubscriptionResp } from "@/models/IGetGamesSubscriptionResp";
import { getGamesSubscription } from "@/queries/getGamesSubscription";
import { useSubscription } from "@apollo/client";
import classes from "./ExistingGames.module.scss";
import { FC, HTMLProps } from "react";
import GameInfo from "../GameInfo/GameInfo";
import { useRouter } from "next/navigation";

interface IProps extends HTMLProps<HTMLDivElement> {
  savePack: boolean;
  isCustomWordlist: boolean;
}

const ExistingGame: FC<IProps> = ({ savePack, isCustomWordlist, ...props }) => {
  const { data, loading, error } =
    useSubscription<IGetGamesSubscriptionResp>(getGamesSubscription);

  const router = useRouter();

  const handleSelectGame = (id: string) => {
    router.push(`/drawit/${id}`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error</div>;
  }

  return (
    <div
      className={`${classes.container}${
        isCustomWordlist ? ` ${classes.expanded}` : ""
      }${savePack ? ` ${classes.extraExpanded}` : ""}${
        props.className ? ` ${props.className}` : ""
      }`}
    >
      <h3 className={classes.title}>Join an existing game</h3>
      {!data?.getGames?.length && <p className={classes.noGames}>No games</p>}
      <div className={classes.games}>
        {data?.getGames?.map((game) => (
          <GameInfo
            key={game.id}
            game={game}
            onClick={() => handleSelectGame(game.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default ExistingGame;
