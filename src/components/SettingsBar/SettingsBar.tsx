import { IDiaryNote } from "@/models/IDiaryNote";
import classes from "./SettingsBar.module.scss";
import { FC } from "react";
import filterDiaryByTitle from "@/actions/filterDiaryByTitle";
import Calendar from "../Calendar/Calendar";

interface ISettingsBarProps {
  setNotes: React.Dispatch<React.SetStateAction<IDiaryNote[]>>;
}

const SettingsBar: FC<ISettingsBarProps> = ({ setNotes }) => {
  let searchTimeout: NodeJS.Timeout | null = null;

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    searchTimeout = setTimeout(async () => {
      try {
        const filteredNotes = await filterDiaryByTitle(e.target.value);
        if (filteredNotes) setNotes(filteredNotes);
      } catch (e) {
        console.error(e);
        setNotes([]);
      }
    }, 1000);
  };

  return (
    <div className={classes.settingsBar}>
      <input
        className={classes.search}
        type="text"
        placeholder="Search..."
        onChange={handleSearch}
      />
      <Calendar className={classes.calendar} />
    </div>
  );
};

export default SettingsBar;
