'use client';

import { FC, HTMLProps, useState } from "react";
import classes from "./DiaryList.module.scss";
import DiaryItem from "../DiaryItem/DiaryItem";
import { IDiaryNote } from "@/models/IDiaryNote";
import ITag from "@/models/ITag";
import SettingsBar from "../SettingsBar/SettingsBar";

interface IDiaryListProps extends HTMLProps<HTMLDivElement> {
  notes: IDiaryNote[];
  tags: ITag[];
}

const DiaryList: FC<IDiaryListProps> = ({ notes, tags, ...props }) => {

  const [notesData, setNotesData] = useState(notes);

  return (
    <div {...props} className={`${props.className} ${classes.container}`}>
      <SettingsBar setNotes={setNotesData} />
      <div className={classes.list}>
        {notesData.map((note) => (
          <DiaryItem key={note._id} note={note} tags={tags} />
        ))}
      </div>
    </div>
  );
};

export default DiaryList;
