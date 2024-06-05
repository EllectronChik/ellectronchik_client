import { IDiaryNote } from "@/models/IDiaryNote";
import ITag from "@/models/ITag";
import { FC, HTMLProps } from "react";
import classes from "./DiaryItem.module.scss";
import Tag from "../Tag/Tag";
import Image from "next/image";
import paperClip from "@/assets/images/paper-clip.svg";
import LoadImage from "../LoadImage/loadImage";

interface IDiaryItemProps extends HTMLProps<HTMLDivElement> {
  note: IDiaryNote;
  tags: ITag[];
}

const DiaryItem: FC<IDiaryItemProps> = ({ note, tags, ...props }) => {
  const notePart = note.encryptedText.slice(0, 250);

  return (
    <div className={classes.container} {...props}>
      <div className={classes.header}>
        <Image
          src={paperClip}
          width={48}
          height={48}
          alt="paper-clip"
          className={classes.paperClip}
          draggable={false}
        />
        <div className={classes.titleContainer}>
          <h2 className={classes.title}>{note.encryptedTitle.slice(0, 15)}</h2>
          <div className={classes.tags}>
            {note.tags.slice(0, 2).map((tag) => (
              <Tag
                key={tag}
                name={tags.find((t) => t._id === tag)?.name || "Unknown"}
                color={tags.find((t) => t._id === tag)?.color || "#000"}
                className={classes.tag}
              />
            ))}
            {note.tags.length > 3 && (
              <Tag
                name={`And ${note.tags.length - 2} more`}
                color="#000"
                className={classes.tag}
                style={{ fontStyle: "italic" }}
              />
            )}
            {note.tags.length === 0 && (
              <Tag
                name="No tags"
                color="#000"
                className={classes.tag}
                style={{ fontStyle: "italic" }}
              />
            )}
            {note.tags.length === 3 && (
              <Tag
                name={
                  tags.find((t) => t._id === note.tags[2])?.name || "Unknown"
                }
                color={
                  tags.find((t) => t._id === note.tags[2])?.color || "#000"
                }
                className={classes.tag}
              />
            )}
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
        <div className={classes.text}>
          {notePart}
          {note.encryptedText.length >= 250 && "..."}
        </div>
        {note.encryptedText.length > 0 && note.diaryNoteMedia.length > 0 && (
          <p className={classes.more}>
            Note contains {note.diaryNoteMedia.length}{" "}
            {note.diaryNoteMedia.length === 1 ? "image" : "images"}
          </p>
        )}
        {note.encryptedText.length === 0 &&
          note.diaryNoteMedia.length === 0 && (
            <p className={classes.more}>Note is empty</p>
          )}
        {note.encryptedText.length === 0 && note.diaryNoteMedia.length > 0 && (
          <div className={classes.images}>
            {note.diaryNoteMedia.map((media) => (
              <LoadImage key={media.mediaIVHex} media={media} className={classes.image} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DiaryItem;
