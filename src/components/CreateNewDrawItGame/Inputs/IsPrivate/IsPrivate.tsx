"use client";
import { Dispatch, FC, SetStateAction } from "react";
import classes from "../../CreateNewDrawItGame.module.scss";
import Switcher from "@/components/Switcher/Switcher";

interface IProps {
  isPrivate: boolean;
  setIsPrivate: Dispatch<SetStateAction<boolean>>;
}

const IsPrivate: FC<IProps> = ({ isPrivate, setIsPrivate }) => {
  return (
    <div className={classes.inputBox}>
      <label className={classes.label} htmlFor="IsPrivate">
        <p>Private room: </p>
      </label>
      <Switcher switcherValue={isPrivate} setValue={setIsPrivate} />
      <input
        className={classes.hidenInput}
        type="checkbox"
        id="IsPrivate"
        checked={isPrivate}
        onChange={(e) => setIsPrivate(e.target.checked)}
      />
    </div>
  );
};

export default IsPrivate;
