"use client";

import classes from "./DrawItStart.module.scss";
import DrawItLogo from "../DrawItLogo/DrawItLogo";
import CreateDrawITPlayer from "../CreateDrawITPlayer/CreateDrawITPlayer";
import { FC, HTMLProps, useState } from "react";
import CreateNewDrawItGame from "../CreateNewDrawItGame/CreateNewDrawItGame";
import { IDrawItPack } from "@/models/IDrawItPack";
import ExistingGame from "../ExistingGames/ExistingGames";

interface IProps extends HTMLProps<HTMLDivElement> {
  initialPlayerName: string;
  initialPlayerAvatarId: number;
  packs: IDrawItPack[];
}

const DrawItStart: FC<IProps> = ({
  initialPlayerName,
  initialPlayerAvatarId,
  packs,
  ...props
}) => {
  const [playerName, setPlayerName] = useState(initialPlayerName);
  const [playerAvatarId, setPlayerAvatarId] = useState(initialPlayerAvatarId);
  const [isCustomWordlist, setIsCustomWordlist] = useState(false);
  const [savePack, setSavePack] = useState(false);

  return (
    <div {...props} className={classes.container}>
      <DrawItLogo>DrawIt</DrawItLogo>
      <div className={classes.startGame}>
        <CreateDrawITPlayer
          playerName={playerName}
          setPlayerName={setPlayerName}
          playerAvatarId={playerAvatarId}
          setPlayerAvatarId={setPlayerAvatarId}
        />
        <div className={classes.createGame}>
          <CreateNewDrawItGame
            packs={packs}
            playerName={playerName}
            playerAvatarId={playerAvatarId}
            isCustomWordlist={isCustomWordlist}
            setIsCustomWordlist={setIsCustomWordlist}
            savePack={savePack}
            setSavePack={setSavePack}
          />
          <p>or</p>
          <ExistingGame
            savePack={savePack}
            isCustomWordlist={isCustomWordlist}
          />
        </div>
      </div>
    </div>
  );
};

export default DrawItStart;
