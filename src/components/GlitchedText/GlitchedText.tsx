import { FC } from "react";
import classes from "./GlitchedText.module.scss";

interface IGlitchedTextProps extends React.HTMLProps<HTMLHeadingElement> {
  text: string;
}

const GlitchedText: FC<IGlitchedTextProps> = ({ text, ...props }) => {
  return (
    <h2
      className={`${classes.hero} ${classes.glitch} ${classes.layers} ${props.className}`}
      data-text={text}
    >
      <span>{text}</span>
    </h2>
  );
};

export default GlitchedText;
