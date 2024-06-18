"use client";

import { Dispatch, FC, SetStateAction, useRef, useState } from "react";
import classes from "../../CreateNewDrawItGame.module.scss";
import { inputHandler } from "@/lib/drawit/inputs/inputHandler";

interface IProps {
  timeLimit: number;
  setTimeLimit: Dispatch<SetStateAction<number>>;
}

const TimeLimit: FC<IProps> = ({ timeLimit, setTimeLimit }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const [inputTimeout, setInputTimeout] = useState<NodeJS.Timeout | null>(null);

  const handleSetPointsToWin = inputHandler({
    setState: setTimeLimit,
    inputRef: inputRef,
    inputTimeout: inputTimeout,
    setInputTimeout: setInputTimeout,
    minValue: 30,
    maxValue: 600,
  }).handleSetState;

  return (
    <div className={classes.inputBox}>
      <label className={classes.label} htmlFor="TimeLimit">
        <p>Time limit: </p>
      </label>
      <input
        className={classes.input}
        type="number"
        id="TimeLimit"
        min={30}
        max={600}
        ref={inputRef}
        defaultValue={timeLimit}
        onChange={handleSetPointsToWin}
      />
    </div>
  );
};

export default TimeLimit;
