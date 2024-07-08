import { NextRequest } from "next/server";
import { revalidateMiddleware } from "./middlewares/revalidateMiddleware";
import { valdateDrawitPlayerData } from "./middlewares/valdateDrawitPlayerData";

export const middleware = async (request: NextRequest) => {
  if (request.nextUrl.pathname.startsWith("/diary")) {
    return revalidateMiddleware(request);
  }
  if (request.nextUrl.pathname.startsWith("/drawit")) {
    return valdateDrawitPlayerData(request);
  }
};
