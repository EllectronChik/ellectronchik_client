"use client";

import { FC, HTMLProps, useState } from "react";
import classes from "./SendDrawItMessage.module.scss";
import { ChatVariants } from "@/models/ChatVariants";
import { useSubscribtionContext } from "@/lib/drawit/subscription-provider";
import Image from "next/image";
import sendSvg from "@/assets/images/send.svg";

interface IProps extends HTMLProps<HTMLTextAreaElement> {
  chatType: ChatVariants;
}

const SendDrawItMessage: FC<IProps> = ({ chatType, ...props }) => {
  const [messageText, setMessageText] = useState("");

  const subscriptionContext = useSubscribtionContext();

  const submitHandler = (e: any) => {
    e.preventDefault();
    if (chatType === ChatVariants.CHAT && messageText.trim() !== "") {
      subscriptionContext?.sendChatMessage(messageText);
      setMessageText("");
    }
  };

  return (
    <div className={classes.container}>
      <textarea
        {...props}
        className={`${classes.textarea}${
          props.className ? ` ${props.className}` : ""
        }`}
        placeholder="Type your message here..."
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            submitHandler(e);
          }
        }}
        value={messageText}
        onChange={(e) => setMessageText(e.target.value)}
      ></textarea>
      <button className={classes.sendButton} onClick={submitHandler}>
        <Image src={sendSvg} alt="send" width={20} height={20} />
      </button>
    </div>
  );
};

export default SendDrawItMessage;
