"use client";

import { IDrawItPack } from "@/models/IDrawItPack";
import { useMutation } from "@apollo/client";
import { Dispatch, FC, HTMLProps, SetStateAction, useState } from "react";
import classes from "./CreateNewDrawItGame.module.scss";
import { useRouter } from "next/navigation";
import PlayersCnt from "./Inputs/PlayersCnt/PlayersCnt";
import PointsToWin from "./Inputs/PointsToWin/PointsToWin";
import OneGuessPoints from "./Inputs/OneGuessPoints/OneGuessPoints";
import TimeLimit from "./Inputs/TimeLimit/TimeLimit";
import IsPrivate from "./Inputs/IsPrivate/IsPrivate";
import IsCustomWordlist from "./Inputs/IsCustomWordlist/IsCustomWordlist";
import Language from "./Inputs/Language/Language";
import WordListId from "./Inputs/WordListId/WordListId";
import PackName from "./Inputs/PackName/PackName";
import SavePack from "./Inputs/SavePack/SavePack";
import PackLanguage from "./Inputs/PackLanguage/PackLanguage";
import IsPackFromFile from "./Inputs/IsPackFromFile/IsPackFromFile";
import LoadPack from "./Inputs/LoadPack/LoadPack";
import CustomWordlist from "./Inputs/CustomWordlist/CustomWordlist";
import { ICreatedGameResp } from "@/models/ICreatedGameResp";
import { ICreateGameVariables } from "@/models/ICreateGameVariables";
import { ICreatedGameWithPackResp } from "@/models/ICreatedGameWithPackResp";
import { ICreateGameWithPackVariables } from "@/models/ICreateGameWithPackVariables";
import { createWithPackGqlMutation } from "@/queries/createDrawItGameWithPackMutation";
import { createGqlMutation } from "@/queries/createDrawItGameMutation";

interface IProps extends HTMLProps<HTMLDivElement> {
  packs: IDrawItPack[];
  playerName: string;
  playerAvatarId: number;
  isCustomWordlist: boolean;
  setIsCustomWordlist: Dispatch<SetStateAction<boolean>>;
  savePack: boolean;
  setSavePack: Dispatch<SetStateAction<boolean>>;
}

const CreateNewDrawItGame: FC<IProps> = ({
  packs,
  playerName,
  playerAvatarId,
  isCustomWordlist,
  setIsCustomWordlist,
  savePack,
  setSavePack,
  ...props
}) => {
  const [createGame] = useMutation<ICreatedGameResp, ICreateGameVariables>(
    createGqlMutation
  );

  const [createGameWithPack] = useMutation<
    ICreatedGameWithPackResp,
    ICreateGameWithPackVariables
  >(createWithPackGqlMutation);

  const router = useRouter();

  const [playerCount, setPlayerCount] = useState(5);
  const [pointsToWin, setPointsToWin] = useState(200);
  const [oneGuessPoints, setOneGuessPoints] = useState(7);
  const [timeLimit, setTimeLimit] = useState(60);
  const [wordlistId, setWordlistId] = useState<string | null>(null);
  const [language, setLanguage] = useState<string>("");
  const [customWordlist, setCustomWordlist] = useState<string[] | null>(null);
  const [isPrivate, setIsPrivate] = useState(false);
  const [packName, setPackName] = useState<string>("");
  const [packLanguage, setPackLanguage] = useState<string>("");
  const [isPackFromFile, setIsPackFromFile] = useState(false);

  const handleCreateNewGame = async () => {
    let newGame = null;
    if (wordlistId || customWordlist) {
      console.log(wordlistId);
      if (savePack && customWordlist) {
        newGame = await createGameWithPack({
          variables: {
            playersCount: playerCount,
            pointsToWin,
            oneGuessPoints,
            timeLimit,
            wordlistId: wordlistId || null,
            customWordlist: customWordlist || null,
            KingPlayerId: "1",
            KingPlayerName: playerName,
            KingPlayerAvatarId: playerAvatarId,
            isPrivate,
            packTitle: packName,
            packLanguage: packLanguage,
            packWordList: customWordlist,
          },
        });
      } else {
        newGame = await createGame({
          variables: {
            playersCount: playerCount,
            pointsToWin,
            oneGuessPoints,
            timeLimit,
            wordlistId: wordlistId || null,
            customWordlist: customWordlist || null,
            KingPlayerId: "1",
            KingPlayerName: playerName,
            KingPlayerAvatarId: playerAvatarId,
            isPrivate,
          },
        });
      }
    }
    if (newGame?.data?.startGame.id) {
      router.push(`/drawit/${newGame.data.startGame.id}`);
    }
  };

  return (
    <div
      className={`${classes.container}${
        isCustomWordlist ? ` ${classes.expanded}` : ""
      }${savePack ? ` ${classes.extraExpanded}` : ""}${
        props.className ? ` ${props.className}` : ""
      }`}
    >
      <h3 className={classes.title}>Create new game</h3>
      <PlayersCnt {...{ playerCount, setPlayerCount }} />
      <PointsToWin {...{ pointsToWin, setPointsToWin, oneGuessPoints }} />
      <OneGuessPoints {...{ oneGuessPoints, setOneGuessPoints }} />
      <TimeLimit {...{ timeLimit, setTimeLimit }} />
      <IsPrivate {...{ isPrivate, setIsPrivate }} />
      <IsCustomWordlist {...{ isCustomWordlist, setIsCustomWordlist }} />
      {!isCustomWordlist && (
        <>
          <Language {...{ language, setLanguage, packs }} />
          <WordListId {...{ packs, language, wordlistId, setWordlistId }} />
        </>
      )}
      {isCustomWordlist && (
        <>
          <SavePack {...{ savePack, setSavePack }} />
          {savePack && (
            <>
              <PackName {...{ packName, setPackName }} />
              <PackLanguage {...{ packLanguage, setPackLanguage }} />
            </>
          )}
          <IsPackFromFile {...{ isPackFromFile, setIsPackFromFile }} />
          {isPackFromFile && (
            <LoadPack
              {...{
                setCustomWordlist,
              }}
            />
          )}
          {!isPackFromFile && (
            <CustomWordlist {...{ customWordlist, setCustomWordlist }} />
          )}
        </>
      )}

      <div className={classes.buttonBox}>
        <button className={classes.button} onClick={handleCreateNewGame}>
          Create game
        </button>
      </div>
    </div>
  );
};

export default CreateNewDrawItGame;
