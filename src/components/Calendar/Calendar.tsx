"use client";

import { FC, HTMLProps, useState } from "react";
import CalendarSvg from "@/assets/images/calendar.svg";
import Image from "next/image";
import classes from "./Calendar.module.scss";

enum DayOfWeek {
  Monday = "monday",
  Tuesday = "tuesday",
  Wednesday = "wednesday",
  Thursday = "thursday",
  Friday = "friday",
  Saturday = "saturday",
  Sunday = "sunday",
}

interface ICalendarProps extends HTMLProps<HTMLDivElement> {}

const Calendar: FC<ICalendarProps> = ({ ...props }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [firstSelectedDay, setFirstSelectedDay] = useState<Date | null>(null);
  const [secondSelectedDay, setSecondSelectedDay] = useState<Date | null>(null);
  const [showedDate, setShowedDate] = useState<Date>(() => {
    const date = new Date();
    date.setDate(1);
    return date;
  });

  const getMonthDays = (month: number, year: number) => {
    return new Date(year, month, 0).getDate();
  };

  console.log(showedDate);
  

  const [days, setDays] = useState<number>(
    getMonthDays(showedDate.getMonth() + 1, showedDate.getFullYear())
  );

  const changeMonth = (value: number) => {};

  return (
    <div {...props} className={`${props.className} ${classes.container}`}>
      <button
        className={classes.calendarIcon}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <Image src={CalendarSvg} className={classes.calendar} alt="calendar" />
      </button>

      {isExpanded && (
        <div className={classes.calendarContainer}>
          <div className={classes.monthSelect}>
            <button className={classes.monthButton}>
              <h3>&lt;</h3>
            </button>
            <button className={classes.monthButton}>
              <h3 className={classes.month}>
                {showedDate.toLocaleString("en", { month: "long" })}
              </h3>
              <h3>,&nbsp;</h3>
              <h3>{showedDate.getFullYear()}</h3>
            </button>
            <button className={classes.monthButton}>
              <h3>&gt;</h3>
            </button>
          </div>

          {Object.values(DayOfWeek).map((day) => (
            <p key={day} className={classes.weekDay}>
              {day.slice(0, 2)}
            </p>
          ))}
          {Array.from({ length: days }).map((_, index) => {
            return (
              <div
                key={index}
                className={classes.day}
                style={{
                  gridArea: `${
                    Math.floor((index + 1 + showedDate.getDate()) / 7) + 3
                  } / ${((index + 1 + showedDate.getDate()) % 7) + 1}`,
                }}
              >
                {index + 1}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Calendar;
