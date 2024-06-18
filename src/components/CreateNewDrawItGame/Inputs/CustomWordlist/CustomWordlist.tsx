"use client";

import { Dispatch, FC, SetStateAction } from "react";
import classes from "../../CreateNewDrawItGame.module.scss";

interface IProps {
  customWordlist: string[] | null;
  setCustomWordlist: Dispatch<SetStateAction<string[] | null>>;
}

const CustomWordlist: FC<IProps> = ({ customWordlist, setCustomWordlist }) => {
  return (
    <div className={classes.columnInputBox}>
      <label className={classes.label} htmlFor="CustomWordlist">
        <p>Custom wordlist: </p>
      </label>
      <textarea
        id="CustomWordlist"
        className={classes.textarea}
        value={customWordlist?.join(",") || ""}
        onChange={(e) => setCustomWordlist(e.target.value.split(","))}
      />
    </div>
  );
};

export default CustomWordlist;
