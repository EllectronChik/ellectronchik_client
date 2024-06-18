"use client";

import { Dispatch, FC, SetStateAction } from "react";
import classes from "../../CreateNewDrawItGame.module.scss";

interface IProps {
  isCustomWordlist: boolean;
  setIsCustomWordlist: Dispatch<SetStateAction<boolean>>;
}

const IsCustomWordlist: FC<IProps> = ({
  isCustomWordlist,
  setIsCustomWordlist,
}) => {
  return (
    <div className={classes.radioBox}>
      <div className={classes.radio}>
        <label htmlFor="IsNotCustomWordlist">Select wordlist: </label>
        <input
          type="radio"
          id="IsNotCustomWordlist"
          checked={!isCustomWordlist}
          onChange={(e) => setIsCustomWordlist(!e.target.checked)}
        />
      </div>
      <div className={classes.radio}>
        <label htmlFor="IsCustomWordlist">Custom wordlist: </label>
        <input
          type="radio"
          id="IsCustomWordlist"
          checked={isCustomWordlist}
          onChange={(e) => setIsCustomWordlist(e.target.checked)}
        />
      </div>
    </div>
  );
};

export default IsCustomWordlist;
