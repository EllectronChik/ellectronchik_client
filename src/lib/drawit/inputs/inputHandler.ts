"use client";

import { ChangeEvent, Dispatch, RefObject, SetStateAction } from "react";

interface IProps {
  setState: Dispatch<SetStateAction<number>>;
  inputRef: RefObject<HTMLInputElement>;
  inputTimeout: NodeJS.Timeout | null;
  setInputTimeout: Dispatch<SetStateAction<NodeJS.Timeout | null>>;
  minValue: number;
  maxValue: number;
}

export const inputHandler = ({
  setState,
  inputRef,
  inputTimeout,
  setInputTimeout,
  minValue,
  maxValue,
}: IProps) => {
  const handleTimeout = (value: number) => {
    setState(value);
    if (inputRef.current) {
      if (inputTimeout) clearTimeout(inputTimeout);
      setInputTimeout(
        setTimeout(() => {
          if (inputRef.current) inputRef.current.value = value.toString();
        }, 1500)
      );
    }
  };

  const handleSetState = (e: ChangeEvent<HTMLInputElement>) => {
    if (isNaN(parseInt(e.target.value))) {
      handleTimeout(minValue);
    } else {
      if (parseInt(e.target.value) < minValue) {
        handleTimeout(minValue);
      } else if (parseInt(e.target.value) > maxValue) {
        handleTimeout(maxValue);
      } else {
        setState(parseInt(e.target.value));
        if (inputTimeout) {
          clearTimeout(inputTimeout);
        }
      }
    }
  };

  return { handleSetState, handleTimeout };
};
