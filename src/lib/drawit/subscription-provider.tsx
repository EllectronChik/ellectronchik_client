"use client";

import { ICommonGameData } from "@/models/ICommonGameData";
import { ISendChatMessageVariables } from "@/models/ISendChatMessageVariables";
import { addChatMessageMutation } from "@/queries/addChatMessageMutation";
import { commonGameDataSubscription } from "@/queries/commonGameDataSubscription";
import { useMutation, useSubscription } from "@apollo/client";
import { PropsWithChildren, createContext, useContext } from "react";
import getCookie from "../client/getCookie";

interface ICommonGameDataResp {
  commonData: ICommonGameData;
}

interface ISubscribtionProviderProps extends PropsWithChildren {
  gameId: string;
}

interface ISubscribtionContext {
  commonGameData: ICommonGameData | null;
  gameId: string;
  sendChatMessage: (message: string) => Promise<void>;
}

const subscribtionContext = createContext<ISubscribtionContext | null>(null);

export default function SubscriptionProvider({
  children,
  gameId,
}: ISubscribtionProviderProps) {
  const { data: commonGameData } = useSubscription<ICommonGameDataResp>(
    commonGameDataSubscription,
    {
      variables: {
        gameId: gameId,
      },
    }
  );

  const [sendChatMessage] = useMutation<boolean, ISendChatMessageVariables>(
    addChatMessageMutation
  );

  const contextValue: ISubscribtionContext = {
    commonGameData: commonGameData?.commonData || null,
    gameId: gameId,
    sendChatMessage: async (message: string) => {
      const playerId = await getCookie("playerId");

      if (!playerId) {
        return;
      }
      await sendChatMessage({
        variables: {
          playerId: playerId,
          gameId: gameId,
          message: message,
        },
      });
    },
  };

  return (
    <subscribtionContext.Provider value={contextValue}>
      {children}
    </subscribtionContext.Provider>
  );
}

export const useSubscribtionContext = () => useContext(subscribtionContext);
