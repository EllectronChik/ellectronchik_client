import { NextRequest } from "next/server";
import { revalidateMiddleware } from "./middlewares/revalidateMiddleware";

export const middleware = async (request: NextRequest) => {
  if (request.nextUrl.pathname.startsWith("/diary")) {
    return revalidateMiddleware(request);
  }
}