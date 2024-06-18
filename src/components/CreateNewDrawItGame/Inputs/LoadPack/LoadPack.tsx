"use strict";

import { Dispatch, DragEvent, FC, SetStateAction, useState } from "react";
import classes from "../../CreateNewDrawItGame.module.scss";

interface IProps {
  setCustomWordlist: Dispatch<SetStateAction<string[] | null>>;
}

const LoadPack: FC<IProps> = ({ setCustomWordlist }) => {
  const [fileDropBoxTimeout, setFileDropBoxTimeout] =
    useState<NodeJS.Timeout | null>(null);
  const [fileDropBoxText, setFileDropBoxText] = useState<string>(
    "Select file or drop it here"
  );

  const handleLoadPack = (file: File) => {
    if (file && file.name.endsWith(".txt")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (typeof e.target?.result === "string") {
          setCustomWordlist(e.target.result.replace(/[\n,]/g, " ").split(" "));
          setFileDropBoxText("File loaded");
        }
      };
      reader.readAsText(file);
    } else {
      setFileDropBoxText(
        "The file must be in .txt format and contain one figure topic per line, or comma separated."
      );
      if (fileDropBoxTimeout) {
        clearTimeout(fileDropBoxTimeout);
      }
      setFileDropBoxTimeout(
        setTimeout(() => {
          setFileDropBoxText("Select file or drop it here");
        }, 3000)
      );
    }
  };

  const handleFileFieldDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      handleLoadPack(event.dataTransfer.files[0]);
    }
  };

  return (
    <div className={classes.columnInputBox}>
      <label className={classes.columnLabel} htmlFor="loadPack">
        <p>Load pack:</p>
        <div
          className={classes.fileField}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleFileFieldDrop}
        >
          <p>{fileDropBoxText}</p>
        </div>
      </label>
      <input
        type="file"
        className={classes.hidenInput}
        id="loadPack"
        accept=".txt"
        onChange={(e) => e.target.files && handleLoadPack(e.target.files[0])}
      />
    </div>
  );
};

export default LoadPack;
