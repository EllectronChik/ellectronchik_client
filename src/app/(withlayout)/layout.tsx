import Header from "@/components/header/Header";
import { CookiesProvider } from "next-client-cookies/server";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <CookiesProvider>
        <Header />
      </CookiesProvider>
      <main>{children}</main>
    </>
  );
}
