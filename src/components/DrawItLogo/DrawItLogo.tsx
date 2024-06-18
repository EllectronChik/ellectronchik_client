"use client";

import { hotink } from "@/lib/fonts";
import classes from "./DrawItLogo.module.scss";
import { FC, HTMLProps, useEffect, useState } from "react";

interface IProps extends HTMLProps<HTMLHeadingElement> {
  children?: string;
}

const DrawItLogo: FC<IProps> = ({ children, ...props }) => {
  const [letters, setLetters] = useState<string[]>(children?.split("") || []);
  const [coloredLetter, setColoredLetter] = useState<number>(-1);

  useEffect(() => {
    const letters = children?.split("");
    if (!letters) return;
    setLetters(letters);
    const interval = setInterval(() => {
      setColoredLetter((prev) => (prev < letters.length - 1 ? prev + 1 : -1));
    }, 1000);

    return () => clearInterval(interval);
  }, [children]);

  if (!letters)
    return (
      <h1
        {...props}
        data-text={children}
        className={`${hotink.className} ${classes.title}`}
      >
        {children}
      </h1>
    );

  return (
    <h1
      {...props}
      data-text={children}
      className={`${hotink.className} ${classes.title}`}
    >
      {letters.map((letter, i) => (
        <span
          key={i}
          className={`${classes.letter} ${
            i === coloredLetter ? classes.colored : ""
          }`}
        >
          {letter}
        </span>
      ))}
    </h1>
  );
};

export default DrawItLogo;
