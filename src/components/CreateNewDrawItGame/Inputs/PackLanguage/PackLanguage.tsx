"use client";

import { Dispatch, FC, SetStateAction } from "react";
import classes from "../../CreateNewDrawItGame.module.scss";

interface IProps {
  packLanguage: string;
  setPackLanguage: Dispatch<SetStateAction<string>>;
}

const PackLanguage: FC<IProps> = ({ packLanguage, setPackLanguage }) => {
  return (
    <div className={classes.columnInputBox}>
    <label className={classes.label} htmlFor="packLanguage">
      <p>Pack language: </p>
    </label>
    <input
      type="text"
      className={classes.input}
      id="packLanguage"
      value={packLanguage}
      onChange={(e) => setPackLanguage(e.target.value)}
    />
  </div>
  )
}

export default PackLanguage