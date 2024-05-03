import classes from "./page.module.scss";
import { cookies } from "next/headers";
import GlitchedText from "@/components/GlitchedText/GlitchedText";
import Link from "next/link";
import { oxta } from "@/lib/fonts";

export default function Home() {
  return (
    <main className={classes.container}>
      <Link
        href={cookies().get("logedIn")?.value ? "/diary" : "/login"}
        className={classes.button}
      >
        <GlitchedText
          text="EllectronChik"
          className={`${classes.title} ${oxta.className}`}
        />
      </Link>
    </main>
  );
}
