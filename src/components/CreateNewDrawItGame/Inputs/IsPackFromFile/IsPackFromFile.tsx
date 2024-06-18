"use client";

import { Dispatch, FC, SetStateAction } from "react";
import classes from "../../CreateNewDrawItGame.module.scss";
import Switcher from "@/components/Switcher/Switcher";

interface IProps {
  isPackFromFile: boolean;
  setIsPackFromFile: Dispatch<SetStateAction<boolean>>;
}

const IsPackFromFile: FC<IProps> = ({ isPackFromFile, setIsPackFromFile }) => {
  return (
    <div className={classes.inputBox}>
      <label htmlFor="isPackFromFile">
        <p>Load pack from .txt file: </p>
      </label>
      <Switcher switcherValue={isPackFromFile} setValue={setIsPackFromFile} />
      <input
        type="checkbox"
        className={classes.hidenInput}
        id="isPackFromFile"
        checked={isPackFromFile}
        onChange={(e) => setIsPackFromFile(e.target.checked)}
      />
    </div>
  );
};

export default IsPackFromFile;
