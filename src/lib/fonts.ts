import localFont from "next/font/local";

export const nunito = localFont({
  src: [
    {
      path: "../assets/fonts/nunito/NunitoSans.woff2",
      style: "normal",
    },
    {
      path: "../assets/fonts/nunito/NunitoSans-Italic.woff2",
      style: "italic",
    },
  ],
});

export const oxta = localFont({
  src: [
    {
      path: "../assets/fonts/oxta/Oxta.woff2",
      style: "normal",
    },
  ],
});


export const hotink = localFont({
  src: [
    {
      path: "../assets/fonts/hotink/HotInk.woff2",
      style: "normal",
    },
  ],
});