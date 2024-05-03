import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
  gql,
} from "@apollo/client";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { setContext } from "@apollo/client/link/context";

interface RevalidateData {
  revalidateToken: {
    accessToken: string;
    refreshToken: string;
  };
}

const httpLink = new HttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_CONNECTON,
});

const authLink = setContext((_, { headers }) => {
  const cookie = headers.cookie;

  return {
    headers: {
      ...headers,
      cookie: cookie ? cookie : "",
    },
  };
});

const client = new ApolloClient({
  link: ApolloLink.from([authLink, httpLink]),
  cache: new InMemoryCache(),
  credentials: "include",
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "no-cache",
      errorPolicy: "ignore",
    },
    query: {
      fetchPolicy: "no-cache",
      errorPolicy: "all",
    },
  },
});

const query = gql`
  query {
    revalidateToken {
      accessToken
      refreshToken
    }
  }
`;

export async function revalidateMiddleware(request: NextRequest) {
  try {
    const { data } = await client.query<RevalidateData>({
      query,
      context: {
        headers: {
          cookie: request.headers.get("cookie"),
        },
      },
    });

    const response = NextResponse.next();

    if (!data.revalidateToken) {
      response.cookies.set("key", "", { maxAge: 0 });
      response.cookies.set("refresh-token", "", { maxAge: 0 });
      response.cookies.set("x-access-token", "", { maxAge: 0 });
      response.cookies.set("logedIn", "", { maxAge: 0 });
    } else {
      response.cookies.set("refresh-token", data.revalidateToken.refreshToken, {
        httpOnly: true,
        sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24 * 30,
      });

      response.cookies.set("x-access-token", data.revalidateToken.accessToken, {
        httpOnly: true,
        sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 15,
      });

      response.cookies.set("logedIn", "true", {
        maxAge: 1000 * 60 * 60 * 24 * 30,
      });
    }

    return response;
  } catch (error) {
    const response = NextResponse.next();
    response.cookies.set("key", "", { maxAge: 0 });
    response.cookies.set("refresh-token", "", { maxAge: 0 });
    response.cookies.set("x-access-token", "", { maxAge: 0 });
    response.cookies.set("logedIn", "", { maxAge: 0 });
    return response;
  }
}
