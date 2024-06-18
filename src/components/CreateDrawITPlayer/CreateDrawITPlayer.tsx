"use client";

import { Dispatch, FC, HTMLProps, SetStateAction, useState } from "react";
import classes from "./CreateDrawITPlayer.module.scss";
import Image from "next/image";
import editImg from "@/assets/images/edit.svg";
import SelectDrawItAvatar from "../SelectDrawItAvatar/SelectDrawItAvatar";

const avatars = Array.from({ length: 26 }, (_, i) =>
  require(`@/assets/images/drawit/avatars/${i}.svg`)
);

interface ICreateDrawITPlayerProps extends HTMLProps<HTMLDivElement> {
  playerName: string;
  setPlayerName: Dispatch<SetStateAction<string>>;
  playerAvatarId: number;
  setPlayerAvatarId: Dispatch<SetStateAction<number>>;
}

const CreateDrawITPlayer: FC<ICreateDrawITPlayerProps> = ({
  playerName,
  setPlayerName,
  playerAvatarId,
  setPlayerAvatarId,
  ...props
}) => {
  const [isSelectingAvatar, setIsSelectingAvatar] = useState(false);

  const handlePlayerNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPlayerName(event.target.value);
    if (typeof document !== "undefined") {
      document.cookie = `playerName=${event.target.value};`;
    }
  };

  return (
    <div
      {...props}
      className={`${props.className ? `${props.className + " "}` : ""}${
        classes.container
      }`}
    >
      <label className={classes.label} htmlFor="AvatarId">
        <Image
          draggable={false}
          priority={true}
          className={classes.avatar}
          src={avatars[playerAvatarId]}
          width={48}
          height={48}
          alt="avatar"
        />
        <div className={classes.editBox}>
          <Image
            draggable={false}
            priority={true}
            className={classes.edit}
            src={editImg}
            width={30}
            height={30}
            alt="edit"
            onClick={() => setIsSelectingAvatar((prevState) => !prevState)}
          />
        </div>
      </label>

      {isSelectingAvatar && (
        <SelectDrawItAvatar
          setAvatarId={setPlayerAvatarId}
          setIsOpen={setIsSelectingAvatar}
        />
      )}
      <div className={classes.inputContainer}>
        <label htmlFor="playerName">Username: </label>
        <input
          type="text"
          name="playerName"
          placeholder="Username"
          value={playerName}
          className={classes.inputName}
          onChange={handlePlayerNameChange}
        />
      </div>
      <input
        type="number"
        name="playerAvatarId"
        value={playerAvatarId}
        className={classes.inputAvatar}
        onChange={(e) => setPlayerAvatarId(+e.target.value)}
      />
    </div>
  );
};

export default CreateDrawITPlayer;
