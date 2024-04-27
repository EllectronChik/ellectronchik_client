import { redirect } from "next/navigation";
import classes from "./page.module.scss";
import { cookies } from "next/headers";
import GlitchedText from "@/components/GlitchedText/GlitchedText";
import Link from "next/link";
import { oxta } from "@/lib/fonts";

export default function Home() {
  if (cookies().get("refresh-token")?.value) {
    redirect("/diary");
  } else {
    return (
      <main className={classes.container}>
        <Link href="/login" className={classes.button}>
          <GlitchedText
            text="EllectronChik"
            className={`${classes.title} ${oxta.className}`}
          />
        </Link>
      </main>
    );
  }
}
