import type { Metadata } from "next";
import "./globals.scss";
import { ApolloWrapper } from "@/lib/graphql/apollo-provider";
import { nunito } from "@/lib/fonts";


export const metadata: Metadata = {
  title: "Страничка EllectronChik'а",
  description: "Просто очередной личный сайт, тут не на что смотреть",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={nunito.className}>
        <ApolloWrapper>{children}</ApolloWrapper>
      </body>
    </html>
  );
}
