import { IDiaryNote } from "@/models/IDiaryNote";
import ITag from "@/models/ITag";
import { FC, HTMLProps } from "react";
import classes from "./DiaryItem.module.scss";
import Tag from "../Tag/Tag";
import Image from "next/image";
import paperClip from "@/assets/images/paper-clip.svg";

interface IDiaryItemProps extends HTMLProps<HTMLDivElement> {
  note: IDiaryNote;
  tags: ITag[];
}

const DiaryItem: FC<IDiaryItemProps> = ({ note, tags, ...props }) => {
  const notePart = note.encryptedText.slice(0, 250);

  return (
    <div className={classes.container} {...props}>
      <div className={classes.header}>
        <Image src={paperClip} width={48} height={48} alt="paper-clip" className={classes.paperClip} draggable={false} />
        <div className={classes.titleContainer}>
          <h2 className={classes.title}>{note.encryptedTitle}</h2>
          <div className={classes.tags}>
            {note.tags.map((tag) => (
              <Tag
                key={tag}
                name={tags.find((t) => t._id === tag)?.name || "Unknown"}
                color={tags.find((t) => t._id === tag)?.color || "#000"}
                className={classes.tag}
              />
            ))}
          </div>
        </div>
        <div className={classes.dates}>
          <p className={classes.date}>
            {note.createdAt
              ? `Created at: ${new Date(note.createdAt).toLocaleString()}`
              : ""}
          </p>
          <p className={classes.date}>
            {note.updatedAt
              ? `Updated at: ${new Date(note.updatedAt).toLocaleString()}`
              : ""}
          </p>
        </div>
      </div>
      <div className={classes.textContainer}>
        <div className={classes.text}>{notePart}...</div>
      </div>
    </div>
  );
};

export default DiaryItem;
