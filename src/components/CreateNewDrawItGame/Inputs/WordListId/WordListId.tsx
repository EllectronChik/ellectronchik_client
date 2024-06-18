"use client";
import { IDrawItPack } from "@/models/IDrawItPack";
import classes from "../../CreateNewDrawItGame.module.scss";
import { Dispatch, FC, SetStateAction } from "react";

interface IProps {
  packs: IDrawItPack[];
  language: string;
  wordlistId: string | null;
  setWordlistId: Dispatch<SetStateAction<string | null>>;
}

const WordListId: FC<IProps> = ({
  packs,
  language,
  wordlistId,
  setWordlistId,
}) => {
  return (
    <div className={classes.columnInputBox}>
      <label className={classes.label} htmlFor="WordlistId">
        Wordlist:{" "}
      </label>
      <select
        id="WordlistId"
        className={classes.selection}
        value={wordlistId || ""}
        onChange={(e) => setWordlistId(e.target.value)}
      >
        <option className={classes.option} value="">
          None
        </option>
        {language !== "" &&
          packs
            .filter((pack) => pack.language === language)
            .map((pack) => (
              <option className={classes.option} key={pack.id} value={pack.id}>
                {pack.title} - {pack.language}
              </option>
            ))}
        {language === "" &&
          packs.map((pack) => (
            <option className={classes.option} key={pack.id} value={pack.id}>
              {pack.title} - {pack.language}
            </option>
          ))}
      </select>
    </div>
  );
};

export default WordListId;
