"use client";

import classes from "./CreateDrawItPlayerOnPage.module.scss";
import CreateDrawITPlayer from "../CreateDrawITPlayer/CreateDrawITPlayer";
import { FC, HTMLProps } from "react";
import getCookie from "@/lib/client/getCookie";
import { useRouter } from "next/navigation";

interface IProps extends HTMLProps<HTMLDivElement> {
  playerName: string | undefined;
  playerAvatarIdStr: string | undefined;
  gameId: string;
}

const CreateDrawItPlayerOnPage: FC<IProps> = ({
  playerName,
  playerAvatarIdStr,
  gameId,
  ...props
}) => {
  const router = useRouter();
  const handleSubmit = async () => {
    playerName = await getCookie("playerName");
    playerAvatarIdStr = await getCookie("playerAvatarId");

    if (playerName && playerAvatarIdStr) {
      router.refresh();
    }
  };

  return (
    <div
      {...props}
      className={`${props.className ? `${props.className} ` : ""}${
        classes.page
      }`}
    >
      <div className={classes.container}>
        <CreateDrawITPlayer className={classes.newPlayer} />
        <button className={classes.btn} onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );
};

export default CreateDrawItPlayerOnPage;
