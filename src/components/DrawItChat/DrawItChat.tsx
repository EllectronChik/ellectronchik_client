"use client";

import { IChatMessage } from "@/models/IChatMessage";
import { FC, HTMLProps, useEffect, useState } from "react";
import classes from "./DrawItChat.module.scss";
import SendDrawItMessage from "../SendDrawItMessage/SendDrawItMessage";
import { ChatVariants } from "@/models/ChatVariants";
import { useSubscribtionContext } from "@/lib/drawit/subscription-provider";

interface IProps extends HTMLProps<HTMLDivElement> {
  initialChat: IChatMessage[];
  chatType: ChatVariants;
}

const DrawItChat: FC<IProps> = ({ initialChat, chatType, ...props }) => {
  const [messages, setMessages] = useState(initialChat);
  const subscriptionContext = useSubscribtionContext();

  useEffect(() => {
    if (subscriptionContext?.commonGameData) {
      if (chatType === ChatVariants.CHAT) {
        setMessages(subscriptionContext.commonGameData.chat);
      } else if (chatType === ChatVariants.GUESSES) {
        setMessages(subscriptionContext.commonGameData.guesses);
      }
    }
  }, [subscriptionContext?.commonGameData, chatType]);

  return (
    <div
      {...props}
      className={`${classes.chat}${
        props.className ? " " + props.className : ""
      }`}
    >
      <div>
        {Object.values(messages).map((chatItem, i) => (
          <div key={i}>
            {chatItem.username ===
            "System_key_247fcf77-2857-493d-aed8-cba7b73e11f9" ? (
              <p className={classes.systemMessage}>{chatItem.message}</p>
            ) : (
              <p className={classes.message}>
                {chatItem.username}: {chatItem.message}
              </p>
            )}
          </div>
        ))}
      </div>

      <SendDrawItMessage
        chatType={chatType}
        className={classes.sendDrawItMessage}
      />
    </div>
  );
};

export default DrawItChat;
