"use client";

import Link from "next/link";
import classes from "./Header.module.scss";
import { usePathname } from "next/navigation";

const Header = async () => {
  const pathname = usePathname();

  return (
    <header className={classes.header}>
      <nav className={classes.navigation}>
        <ul className={classes.list}>
          <li
            className={`${classes.listItem} ${
              pathname === "/diary" ? classes.active : ""
            }`}
          >
            <Link className={classes.link} href="/diary">Diary</Link>
          </li>
          <li
            className={`${classes.listItem} ${
              pathname === "/tasks" ? classes.active : ""
            }`}
          >
            <Link className={classes.link} href="/tasks">Tasks</Link>
          </li>
          <li
            className={`${classes.listItem} ${
              pathname === "/goals" ? classes.active : ""
            }`}
          >
            <Link className={classes.link} href="/goals">Goals</Link>
          </li>
        </ul>
      </nav>
      <button className={classes.logout}>
        Logout
      </button>
    </header>
  );
};

export default Header;
