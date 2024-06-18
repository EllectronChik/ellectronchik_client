"use client";

import { IGame } from "@/models/IStartedGame";
import classes from "./GameInfo.module.scss";
import { FC, HTMLProps } from "react";

interface IProps extends HTMLProps<HTMLDivElement> {
  game: IGame;
}

const GameInfo: FC<IProps> = ({ game, ...props }) => {
  return (
    <div
      {...props}
      className={`${props.className ? `${props.className} ` : ""}${
        classes.container
      }`}
    >
      <h4 className={classes.title}>{game.package} - {game.language}</h4>
      <p className={classes.players}>Players: 0 / {game.playersCount}</p>
      <p className={classes.points}>Points to win: {game.pointsToWin}</p>
    </div>
  );
};

export default GameInfo;
