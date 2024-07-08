import { getClient } from "@/lib/graphql/client";
import { IJoinGameResp } from "@/models/IJoinGameResp";
import { IJoinGameVariables } from "@/models/IJoinGameVariables";
import { JoinGameMutation } from "@/queries/joinGameMutation";
import { cookies } from "next/headers";
import classes from "./DrawItGame.module.scss";
import { redirect } from "next/navigation";
import { FetchResult } from "@apollo/client";
import DrawItChat from "@/components/DrawItChat/DrawItChat";
import SubscriptionProvider from "@/lib/drawit/subscription-provider";
import { ChatVariants } from "@/models/ChatVariants";
import CreateDrawItPlayerOnPage from "@/components/CreateDrawItPlayerOnPage/CreateDrawItPlayerOnPage";

const DrawItGame = async ({ params }: { params: { id: string } }) => {
  const client = getClient();

  let playerName = cookies().get("playerName")?.value;
  let playerAvatarIdStr = cookies().get("playerAvatarId")?.value;

  let errorMessage: string | null = null;

  let joinGameResp: FetchResult<IJoinGameResp> | undefined = undefined;

  if (!playerName || !playerAvatarIdStr) {
    return (
      <CreateDrawItPlayerOnPage
        playerName={playerName}
        playerAvatarIdStr={playerAvatarIdStr}
        gameId={params.id}
      />
    );
  }

  if (playerName && playerAvatarIdStr) {
    let playerId = cookies().get("playerId")?.value;

    if (!playerId) {
      return;
    }

    const playerAvatarId = parseInt(playerAvatarIdStr, 10);
    if (!isNaN(playerAvatarId)) {
      try {
        joinGameResp = await client.mutate<IJoinGameResp, IJoinGameVariables>({
          mutation: JoinGameMutation,
          variables: {
            playerName: playerName,
            playerAvatar: playerAvatarId,
            playerId: playerId,
            gameId: params.id,
          },
        });
      } catch (error: any) {
        if (
          error.message === "Game is full" ||
          error.message === "Game not found"
        ) {
          redirect("/drawit");
        }
        errorMessage = error.message;
      }
    } else {
      errorMessage = "Invalid player avatar id";
    }
  }

  if (errorMessage) {
    return <div className={classes.page}>{errorMessage}</div>;
  }

  return (
    <div className={classes.page}>
      {joinGameResp?.data && (
        <SubscriptionProvider gameId={params.id}>
          <DrawItChat
            initialChat={joinGameResp.data.joinGame.chat}
            chatType={ChatVariants.CHAT}
          />
        </SubscriptionProvider>
      )}
    </div>
  );
};

export default DrawItGame;
