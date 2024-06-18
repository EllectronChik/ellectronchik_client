"use client";
import classes from "../../CreateNewDrawItGame.module.scss";
import Image from "next/image";
import { Dispatch, FC, SetStateAction, useRef, useState } from "react";
import { Tooltip } from "react-tooltip";
import infoSvg from "@/assets/images/info.svg";
import { inputHandler } from "@/lib/drawit/inputs/inputHandler";

interface IProps {
  oneGuessPoints: number;
  setOneGuessPoints: Dispatch<SetStateAction<number>>;
}

const OneGuessPoints: FC<IProps> = ({ oneGuessPoints, setOneGuessPoints }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const [inputTimeout, setInputTimeout] = useState<NodeJS.Timeout | null>(null);

  const handleSetOneGuessPoints = inputHandler({
    setState: setOneGuessPoints,
    inputRef: inputRef,
    inputTimeout: inputTimeout,
    setInputTimeout: setInputTimeout,
    minValue: 1,
    maxValue: 10,
  }).handleSetState;

  return (
    <div className={classes.inputBox}>
      <label className={classes.label} htmlFor="OneGuessPoints">
        <Tooltip
          id="oneGuessPointsTooltip"
          content="The maximum number of points (from 1 to 10) that can be obtained for the first guess is indicated. Players will receive fewer points for each subsequent guess."
          className={classes.tooltip}
          border={"2px solid #ff99cc"}
          place="top"
        />
        <p>Points per guess: </p>
        <Image
          data-tooltip-id="oneGuessPointsTooltip"
          className={classes.info}
          src={infoSvg}
          alt="info"
          width={20}
          height={20}
        />
      </label>
      <input
        className={classes.input}
        type="number"
        id="OneGuessPoints"
        min={1}
        max={10}
        ref={inputRef}
        defaultValue={oneGuessPoints}
        onChange={handleSetOneGuessPoints}
      />
    </div>
  );
};

export default OneGuessPoints;
