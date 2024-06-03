"use client";

import { ChangeEvent, FC, HTMLProps, useEffect, useRef, useState } from "react";
import classes from "./CreateNoteCard.module.scss";
import ITag from "@/models/ITag";
import Tag from "../Tag/Tag";
import CreateTag from "../CreateTag/CreateTag";
import { gql, useMutation } from "@apollo/client";
import * as crypto from "crypto";
import encryptText from "@/actions/encryptText";
import { IDiaryNoteDecrypted } from "@/models/IDiaryNoteDecrypted";
import revalidateDiary from "@/actions/revalidateDiary";

interface ICreateNoteCardProps extends HTMLProps<HTMLDivElement> {
  tags: ITag[];
  selectedTags?: ITag[];
  note?: IDiaryNoteDecrypted;
}

interface ICreateNoteCardData {
  createDiaryNote: {
    iv: string;
    _id: string;
  };
}

interface ICreateNoteCardVariables {
  encryptedTitle: string;
  encryptedText: string;
  tags: string[];
  iv: string;
}

interface IUpdateNoteData {
  updateDiaryNote: {
    iv: string;
    _id: string;
  };
}

interface IUpdateNoteVariables {
  id: string;
  encryptedTitle: string;
  encryptedText: string;
  tags: string[];
  iv: string;
}

const CreateNoteCard: FC<ICreateNoteCardProps> = ({
  tags,
  note,
  selectedTags,
  ...props
}) => {
  const [postTimeout, setPostTimeout] = useState<NodeJS.Timeout>();
  const [tagsData, setTagsData] = useState<ITag[]>(tags);
  const [selectedTagsData, setSelectedTagsData] = useState<ITag[]>(
    selectedTags || []
  );
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [title, setTitle] = useState<string>("");
  const [text, setText] = useState<string>("");

  const [noteIv, setNoteIv] = useState<string>("");
  const [noteId, setNoteId] = useState<string>("");

  const selectRef = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setText(note.text);
      setSelectedTagsData(tags.filter((tag) => note.tags.includes(tag._id)));
      setNoteIv(note.iv);
      setNoteId(note._id);
    }
  }, [note, tags]);

  const createNoteGql = gql`
    mutation CreateDiaryNote(
      $encryptedTitle: String!
      $encryptedText: String!
      $tags: [String!]
      $iv: String!
    ) {
      createDiaryNote(
        createNoteInput: {
          encryptedTitle: $encryptedTitle
          encryptedText: $encryptedText
          tags: $tags
          iv: $iv
        }
      ) {
        _id
        iv
      }
    }
  `;

  const updateNoteGql = gql`
    mutation UpdateDiaryNote(
      $encryptedTitle: String
      $encryptedText: String
      $tags: [String!]
      $iv: String
      $id: String!
    ) {
      updateDiaryNote(
        updateNoteInput: {
          encryptedTitle: $encryptedTitle
          encryptedText: $encryptedText
          tags: $tags
          iv: $iv
          id: $id
        }
      ) {
        _id
        iv
      }
    }
  `;

  const [createNote] = useMutation<
    ICreateNoteCardData,
    ICreateNoteCardVariables
  >(createNoteGql, {
    errorPolicy: "all",
  });

  const [updateNote] = useMutation<IUpdateNoteData, IUpdateNoteVariables>(
    updateNoteGql,
    {
      errorPolicy: "all",
    }
  );

  const handleCreateNote = async (
    uTitle?: string,
    uText?: string,
    uTags?: string[]
  ) => {
    const iv = crypto.randomBytes(16).toString("hex");
    const encryptedData = await encryptText(uTitle || title, uText || text, iv);
    await createNote({
      variables: {
        encryptedTitle: encryptedData.title,
        encryptedText: encryptedData.text,
        tags: uTags || selectedTagsData.map((tag) => tag._id),
        iv: iv,
      },
      onCompleted: async (data) => {
        setNoteIv(data.createDiaryNote.iv);
        setNoteId(data.createDiaryNote._id);

        await revalidateDiary();
      },
    });
  };

  const handleUpdateNote = async (
    uTitle?: string,
    uText?: string,
    uTags?: string[]
  ) => {
    const encryptedData = await encryptText(
      uTitle || title,
      uText || text,
      noteIv
    );

    await updateNote({
      variables: {
        encryptedTitle: encryptedData.title,
        encryptedText: encryptedData.text,
        tags: uTags || selectedTagsData.map((tag) => tag._id),
        iv: noteIv,
        id: noteId,
      },
      onCompleted: async () => {
        await revalidateDiary();
      },
    });
  };

  const handleTagRemove = (tagId: string) => {
    setSelectedTagsData(selectedTagsData.filter((tag) => tag._id !== tagId));

    if (selectRef.current) {
      selectRef.current.value = "";
    }
  };

  const handleChangeTitle = (e: ChangeEvent<HTMLInputElement>) => {
    if (postTimeout) {
      clearTimeout(postTimeout);
    }
    setPostTimeout(
      setTimeout(async () => {
        if (e.target.value !== "" && noteIv === "") {
          await handleCreateNote(e.target.value);
        } else if (noteIv !== "") {
          await handleUpdateNote(e.target.value);
        }
      }, 1000)
    );
    setTitle(e.target.value);
  };

  const handleChangeText = (e: ChangeEvent<HTMLTextAreaElement>) => {
    if (postTimeout) {
      clearTimeout(postTimeout);
    }
    setPostTimeout(
      setTimeout(async () => {
        if (e.target.value !== "" && noteIv === "") {
          await handleCreateNote(title, e.target.value);
        } else if (noteIv !== "") {
          await handleUpdateNote(title, e.target.value);
        }
      }, 1000)
    );
    setText(e.target.value);
  };

  const handleSelectTags = (e: ChangeEvent<HTMLSelectElement>) => {
    if (postTimeout) {
      clearTimeout(postTimeout);
    }
    const selectedTags = tagsData.filter((tag) =>
      Array.from(e.target.selectedOptions, (option) => option.value).includes(
        tag._id
      )
    );
    setPostTimeout(
      setTimeout(async () => {
        if (e.target.value !== "" && noteIv === "") {
          await handleCreateNote(
            title,
            text,
            selectedTags.map((tag) => tag._id)
          );
        } else if (noteIv !== "") {
          await handleUpdateNote(
            title,
            text,
            selectedTags.map((tag) => tag._id)
          );
        }
      }, 1000)
    );
    setSelectedTagsData(selectedTags);
  };

  return (
    <div {...props} className={`${classes.card} ${props.className}`}>
      <input
        onChange={handleChangeTitle}
        type="text"
        value={title}
        placeholder="Title"
        className={classes.title}
      />
      <textarea
        value={text}
        onChange={handleChangeText}
        placeholder="Text"
        className={classes.text}
      />
      <div className={classes.tagsContainer}>
        {selectedTagsData.map((tag) => (
          <Tag
            key={tag._id}
            name={tag.name}
            color={tag.color}
            canClick
            className={classes.tag}
            onClick={() => handleTagRemove(tag._id)}
          />
        ))}
      </div>
      <div className={classes.tagsSelectorContainer}>
        <select
          onChange={handleSelectTags}
          multiple
          name="tags"
          id="tags"
          ref={selectRef}
          className={classes.tagsSelector}
        >
          {tagsData.map((tag) => (
            <option
              key={tag._id}
              value={tag._id}
              className={`${classes.tagOption} ${
                selectedTagsData.find((t) => t._id === tag._id)
                  ? classes.selected
                  : ""
              }`}
            >
              {tag.name}
            </option>
          ))}
        </select>
        <button
          className={classes.addTagButton}
          onClick={() => setIsAddingTag(true)}
        >
          Add tag
        </button>
      </div>

      {isAddingTag && (
        <CreateTag
          className={classes.createTag}
          setTagsData={setTagsData}
          setIsAddingTag={setIsAddingTag}
        />
      )}
    </div>
  );
};

export default CreateNoteCard;
