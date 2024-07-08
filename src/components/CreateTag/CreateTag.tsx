"use client";

import ITag from "@/models/ITag";
import {
  Dispatch,
  FC,
  FormEvent,
  HTMLProps,
  SetStateAction,
  useState,
} from "react";
import classes from "./CreateTag.module.scss";
import { gql, useMutation } from "@apollo/client";
import { createTagMutation } from "@/queries/createTagMutation";

interface ICreateTagProps extends HTMLProps<HTMLFormElement> {
  setTagsData: Dispatch<SetStateAction<ITag[]>>;
  setIsAddingTag: Dispatch<SetStateAction<boolean>>;
}

interface ICreateTagData {
  createTag: ITag;
}

interface ICreateTagVariables {
  name: string;
  color: string;
}

const CreateTag: FC<ICreateTagProps> = ({
  setTagsData,
  setIsAddingTag,
  ...props
}) => {
  const [name, setName] = useState<string>("");
  const [color, setColor] = useState<string>("");

  const [createTag, { error }] = useMutation<
    ICreateTagData,
    ICreateTagVariables
  >(createTagMutation, {
    variables: {
      name,
      color,
    },
    errorPolicy: "all",
    onCompleted: (data) => {
      setTagsData((prev) => [...prev, data.createTag]);
      setIsAddingTag(false);
    },
    onError: () => {
      console.error(error);
    },
  });

  const handleCreateTag = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    createTag({
      variables: {
        name,
        color,
      },
    });
  };

  return (
    <>
      <form
        {...props}
        className={`${classes.form} ${props.className ? props.className : ""}`}
        onSubmit={handleCreateTag}
        style={{ borderColor: color }}
      >
        <input
          className={classes.nameInput}
          style={{ borderColor: color }}
          type="text"
          placeholder="Tag name"
          onChange={(e) => setName(e.target.value)}
        />
        <label
          className={classes.colorLabel}
          style={{ backgroundColor: color ? color : "#000" }}
          htmlFor="color"
        ></label>
        <input
          id="color"
          className={classes.colorInput}
          type="color"
          placeholder="Tag color"
          onChange={(e) => setColor(e.target.value)}
        />
        <button className={classes.button} type="submit">
          &#10003;
        </button>
      </form>
      {error && <p className={classes.error}>Something went wrong</p>}
    </>
  );
};

export default CreateTag;
