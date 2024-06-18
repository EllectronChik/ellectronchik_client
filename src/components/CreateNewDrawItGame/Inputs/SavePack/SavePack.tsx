"use client";

import { Dispatch, FC, SetStateAction } from "react";
import classes from "../../CreateNewDrawItGame.module.scss";
import Switcher from "@/components/Switcher/Switcher";

interface IProps {
  savePack: boolean;
  setSavePack: Dispatch<SetStateAction<boolean>>;
}

const SavePack: FC<IProps> = ({ savePack, setSavePack }) => {
  return (
    <div className={classes.inputBox}>
      <label className={classes.label} htmlFor="savePack">
        <p>Save pack on server: </p>
      </label>
      <Switcher switcherValue={savePack} setValue={setSavePack} />
      <input
        className={classes.hidenInput}
        type="checkbox"
        id="savePack"
        checked={savePack}
        onChange={(e) => setSavePack(e.target.checked)}
      />
    </div>
  );
};

export default SavePack;
