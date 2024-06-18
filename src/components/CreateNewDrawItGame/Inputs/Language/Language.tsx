"use client";

import { Dispatch, FC, SetStateAction } from "react";
import classes from "../../CreateNewDrawItGame.module.scss";
import { IDrawItPack } from "@/models/IDrawItPack";

interface IProps {
  packs: IDrawItPack[];
  language: string;
  setLanguage: Dispatch<SetStateAction<string>>;
}

const Language: FC<IProps> = ({ packs, language, setLanguage }) => {
  return (
    <div className={classes.inputBox}>
      <label className={classes.label} htmlFor="Language">
        <p>Language: </p>
      </label>
      <select
        id="Language"
        className={classes.selection}
        value={language || ""}
        onChange={(e) => setLanguage(e.target.value)}
      >
        <option className={classes.option} value="">
          All
        </option>
        {packs.map((pack) => (
          <option
            key={pack.id}
            className={classes.option}
            value={pack.language}
          >
            {pack.language}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Language;
