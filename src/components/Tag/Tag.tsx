import { FC, HTMLProps } from "react";
import classes from "./Tag.module.scss";

interface ITagProps extends HTMLProps<HTMLDivElement> {
  name: string;
  color: string;
  canClick?: boolean;
}

const Tag: FC<ITagProps> = ({ name, color, canClick = false, ...props }) => {
  return (
    <div
      style={{ borderColor: color }}
      {...props}
      className={`${classes.container} ${props.className} ${
        canClick ? classes.clickable : ""
      }`}
    >
      <p className={classes.name}>{name}</p>
      <span
        className={`${classes.color} ${canClick ? classes.clickable : ""}`}
        style={{ backgroundColor: color }}
      />
    </div>
  );
};

export default Tag;
