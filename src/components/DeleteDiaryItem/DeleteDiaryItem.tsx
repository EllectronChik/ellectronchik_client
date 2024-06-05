"use client";

import Image from "next/image";
import { FC, HTMLProps, useState } from "react";
import classes from "./DeleteDiaryItem.module.scss";
import DeleteImg from "@/assets/images/delete.svg";
import ErrorImg from "@/assets/images/cancel.svg";
import OkImg from "@/assets/images/ok.svg";
import { gql, useMutation } from "@apollo/client";
import revalidateDiary from "@/actions/revalidateDiary";
import { useRouter } from "next/navigation";

interface IDeleteDiaryItemProps extends HTMLProps<HTMLButtonElement> {
  id: string;
}

const DeleteDiaryItem: FC<IDeleteDiaryItemProps> = ({ id, ...props }) => {
  const deleteDiaryItemGql = gql`
    mutation DeleteDiaryNote($id: String!) {
      deleteDiaryNote(id: $id) {
        _id
      }
    }
  `;

  const router = useRouter();

  const handleError = () => {
    setError(true);
    if (errorTimeout) {
      clearTimeout(errorTimeout);
    }
    setErrorTimeout(setTimeout(() => setError(false), 3000));
  };

  const handleSuccess = () => {
    setSubmit(true);
    revalidateDiary().then(() => {
      setSubmit(false);
      router.push("/diary");
    });
  };

  const [error, setError] = useState<boolean>(false);
  const [submit, setSubmit] = useState<boolean>(false);
  const [errorTimeout, setErrorTimeout] = useState<NodeJS.Timeout | null>(null);

  const [deleteDiaryItem] = useMutation(deleteDiaryItemGql, {
    variables: {
      id,
    },
    errorPolicy: "all",
    onCompleted: handleSuccess,
    onError: handleError,
  });

  return (
    <button
      onClick={() => deleteDiaryItem()}
      className={`${classes.button}${
        props.className ? " " + props.className : ""
      }`}
      {...props}
      type="button"
    >
      <Image
        className={classes.icon}
        src={error ? ErrorImg : submit ? OkImg : DeleteImg}
        alt="paper-clip"
      />
    </button>
  );
};

export default DeleteDiaryItem;
