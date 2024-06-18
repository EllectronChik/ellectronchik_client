"use client";

import classes from "../../CreateNewDrawItGame.module.scss";
import Image from "next/image";
import infoSvg from "@/assets/images/info.svg";
import { Tooltip } from "react-tooltip";
import { Dispatch, FC, SetStateAction, useRef, useState } from "react";
import { inputHandler } from "@/lib/drawit/inputs/inputHandler";

interface IProps {
  playerCount: number;
  setPlayerCount: Dispatch<SetStateAction<number>>;
}

const PlayersCnt: FC<IProps> = ({ playerCount, setPlayerCount }) => {
  const inputPlayerCntRef = useRef<HTMLInputElement>(null);

  const [inputTimeout, setInputTimeout] = useState<NodeJS.Timeout | null>(null);

  const handleSetPlayersCount = inputHandler({
    setState: setPlayerCount,
    inputRef: inputPlayerCntRef,
    inputTimeout: inputTimeout,
    setInputTimeout: setInputTimeout,
    minValue: 3,
    maxValue: 50,
  }).handleSetState;

  return (
    <div className={classes.inputBox}>
      <label className={classes.label} htmlFor="PlayerCount">
        <Tooltip
          id="playerCountTooltip"
          content="The number of players in the game. Not less than 3, not more than 50"
          border={"2px solid #ff99cc"}
          className={classes.tooltip}
          place="top"
        />
        <p>Players count: </p>
        <Image
          data-tooltip-id="playerCountTooltip"
          className={classes.info}
          src={infoSvg}
          alt="info"
          width={20}
          height={20}
        />
      </label>
      <input
        className={classes.input}
        ref={inputPlayerCntRef}
        type="number"
        id="PlayerCount"
        min={3}
        max={50}
        defaultValue={playerCount}
        onChange={handleSetPlayersCount}
      />
    </div>
  );
};

export default PlayersCnt;
