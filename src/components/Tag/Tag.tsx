import { FC, HTMLProps } from "react";
import classes from "./Tag.module.scss";

interface ITagProps extends HTMLProps<HTMLDivElement> {
  name: string;
  color: string;
}

const Tag: FC<ITagProps> = ({ name, color, ...props }) => {
  return (
    <div style={{ borderColor: color }} {...props} className={`${classes.container} ${props.className}`}>
      <p className={classes.name}>{name}</p>
      <span className={classes.color} style={{ backgroundColor: color }} />
    </div>
  );
};

export default Tag;
