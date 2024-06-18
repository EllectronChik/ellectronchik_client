"use client";

import { Dispatch, FC, HTMLProps, KeyboardEvent, SetStateAction } from "react";
import classes from "./Switcher.module.scss";

interface ISwitcherProps extends HTMLProps<HTMLDivElement> {
  switcherValue: boolean;
  setValue: Dispatch<SetStateAction<boolean>>;
}

const Switcher: FC<ISwitcherProps> = ({
  switcherValue,
  setValue,
  ...props
}) => {
  const handleKeydown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setValue(!switcherValue);
    }
  };

  return (
    <div
      role="switch"
      aria-checked={switcherValue}
      tabIndex={0}
      {...props}
      className={`${props.className ? `${props.className} ` : ""}${
        classes.container
      }${switcherValue ? ` ${classes.switcherOn}` : ""}`}
      onClick={() => setValue(!switcherValue)}
      onKeyDown={handleKeydown}
    >
      <span className={classes.switcher} />
    </div>
  );
};

export default Switcher;
