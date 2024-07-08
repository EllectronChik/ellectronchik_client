import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from 'uuid';

export async function valdateDrawitPlayerData(request: NextRequest) {
  const playerAvatarId = request.cookies.get("playerAvatarId");

  const response = NextResponse.next();
  if (
    playerAvatarId &&
    (isNaN(parseInt(playerAvatarId.value)) ||
      parseInt(playerAvatarId.value) < 0 ||
      parseInt(playerAvatarId.value) > 25)
  ) {
    response.cookies.set("playerAvatarId", "0", {
      maxAge: 1000 * 24 * 60 * 60 * 31,
    });
  }
  if (!request.cookies.get("playerId")) {
    response.cookies.set("playerId", uuidv4(), {
      maxAge: 1000 * 24 * 60 * 60 * 31,
    });
  }
  return response;
}
