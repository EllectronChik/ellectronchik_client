"use client";

import { Dispatch, FC, SetStateAction } from "react";
import classes from "../../CreateNewDrawItGame.module.scss";

interface IProps {
  packName: string;
  setPackName: Dispatch<SetStateAction<string>>;
}

const PackName: FC<IProps> = ({ packName, setPackName }) => {
  return (
    <div className={classes.columnInputBox}>
      <label className={classes.label} htmlFor="packName">
        <p>Pack name:</p>
      </label>
      <input
        type="text"
        className={classes.input}
        id="packName"
        value={packName}
        onChange={(e) => setPackName(e.target.value)}
      />
    </div>
  );
};

export default PackName;
