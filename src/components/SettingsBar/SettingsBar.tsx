"use client";

import { IDiaryNote } from "@/models/IDiaryNote";
import classes from "./SettingsBar.module.scss";
import { FC, useState } from "react";
import filterDiary from "@/actions/filterDiary";
import Calendar from "../Calendar/Calendar";
import Image from "next/image";
import CreateNote from "@/assets/images/create-note.svg";
import Link from "next/link";

interface ISettingsBarProps {
  setNotes: React.Dispatch<React.SetStateAction<IDiaryNote[]>>;
}

const SettingsBar: FC<ISettingsBarProps> = ({ setNotes }) => {
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(
    null
  );
  const [firstSelectedDay, setFirstSelectedDay] = useState<Date | null>(null);
  const [secondSelectedDay, setSecondSelectedDay] = useState<Date | null>(null);
  const [title, setTitle] = useState<string | null>(null);

  const handleFilterNotes = async (
    uTitle?: string,
    uFirstDate?: Date,
    uSecondDate?: Date
  ) => {
    const filteredNotes = await filterDiary(
      uTitle !== undefined ? uTitle : title ? title : "",
      1,
      10,
      1,
      uFirstDate ? uFirstDate : firstSelectedDay ? firstSelectedDay : undefined,
      uSecondDate
        ? uSecondDate
        : secondSelectedDay
        ? secondSelectedDay
        : undefined,
      []
    );

    if (filteredNotes) setNotes(filteredNotes);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    setSearchTimeout(
      setTimeout(async () => {
        try {
          handleFilterNotes(e.target.value);
        } catch (e) {
          console.error(e);
          setNotes([]);
        }
      }, 1000)
    );
  };

  const timeReset = () => {
    setFirstSelectedDay(null);
    setSecondSelectedDay(null);
  };

  return (
    <div className={classes.settingsBar}>
      <input
        className={classes.search}
        type="text"
        placeholder="Search..."
        onChange={handleSearch}
      />
      <Calendar
        className={classes.calendar}
        firstSelectedDay={firstSelectedDay}
        secondSelectedDay={secondSelectedDay}
        setFirstSelectedDay={setFirstSelectedDay}
        setSecondSelectedDay={setSecondSelectedDay}
      />
      <button
        onClick={() => {
          handleFilterNotes(
            title ? title : undefined,
            firstSelectedDay ? firstSelectedDay : undefined,
            secondSelectedDay ? secondSelectedDay : undefined
          );
        }}
        title="Submit time filter"
        className={classes.filterByDate}
      >
        &#10003;
      </button>
      <button onClick={timeReset} className={classes.close}>
        &times;
      </button>
      <div>
        <p>
          First selected day:{" "}
          {firstSelectedDay ? firstSelectedDay.toLocaleDateString() : ""}
        </p>
        <p>
          Second selected day:{" "}
          {secondSelectedDay ? secondSelectedDay.toLocaleDateString() : ""}
        </p>
      </div>
      <Link href="/diary/create" className={classes.createNoteButton}>
        <Image
          src={CreateNote}
          alt="create-note"
          className={classes.createNote}
        />
      </Link>
    </div>
  );
};

export default SettingsBar;
