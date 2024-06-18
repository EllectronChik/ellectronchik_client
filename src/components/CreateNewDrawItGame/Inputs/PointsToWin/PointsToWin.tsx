"use client";

import { FC, useRef, useState } from "react";
import classes from "../../CreateNewDrawItGame.module.scss";
import { inputHandler } from "@/lib/drawit/inputs/inputHandler";

interface IProps {
  pointsToWin: number;
  setPointsToWin: React.Dispatch<React.SetStateAction<number>>;
  oneGuessPoints: number;
}

const PointsToWin: FC<IProps> = ({
  pointsToWin,
  setPointsToWin,
  oneGuessPoints,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const [inputTimeout, setInputTimeout] = useState<NodeJS.Timeout | null>(null);

  const handleSetPointsToWin = inputHandler({
    setState: setPointsToWin,
    inputRef: inputRef,
    inputTimeout: inputTimeout,
    setInputTimeout: setInputTimeout,
    minValue: oneGuessPoints,
    maxValue: oneGuessPoints * 50,
  }).handleSetState;

  return (
    <div className={classes.inputBox}>
      <label className={classes.label} htmlFor="PointsToWin">
        <p>Points to win: </p>
      </label>
      <input
        className={classes.input}
        ref={inputRef}
        type="number"
        id="PointsToWin"
        min={oneGuessPoints}
        max={oneGuessPoints * 50}
        defaultValue={pointsToWin}
        onChange={handleSetPointsToWin}
      />
    </div>
  );
};

export default PointsToWin;
