"use client";

import { Dispatch, FC, HTMLProps, SetStateAction } from "react";
import classes from "./SelectDrawItAvatar.module.scss";
import Image from "next/image";

const avatars = Array.from({ length: 26 }, (_, i) =>
  require(`@/assets/images/drawit/avatars/${i}.svg`)
);

interface IProps extends HTMLProps<HTMLDivElement> {
  setAvatarId: Dispatch<SetStateAction<number>>;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const SelectDrawItAvatar: FC<IProps> = ({
  setAvatarId,
  setIsOpen,
  ...props
}) => {
  const handleAvatarClick = (i: number) => {
    setAvatarId(i);
    setIsOpen(false);
    if (typeof document !== "undefined") {
      document.cookie = `playerAvatarId=${i};`;
    }
  };

  return (
    <div {...props} className={classes.container}>
      <div className={classes.header}>
        <h3 className={classes.title}>Select an avatar</h3>
        <button onClick={() => setIsOpen(false)} className={classes.close}>
          {" "}
          &#65794;
        </button>
      </div>
      <div className={classes.avatars}>
        {avatars.map((avatar, i) => (
          <div
            key={i}
            className={classes.avatar}
            onClick={() => handleAvatarClick(i)}
          >
            <Image
              draggable={false}
              src={avatar}
              width={48}
              height={48}
              alt="avatar"
              className={classes.image}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SelectDrawItAvatar;
