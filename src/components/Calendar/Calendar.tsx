"use client";

import {
  Dispatch,
  FC,
  HTMLProps,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import CalendarSvg from "@/assets/images/calendar.svg";
import Image from "next/image";
import classes from "./Calendar.module.scss";

enum DayOfWeek {
  Monday = "Monday",
  Tuesday = "Tuesday",
  Wednesday = "Wednesday",
  Thursday = "Thursday",
  Friday = "Friday",
  Saturday = "Saturday",
  Sunday = "Sunday",
}

interface ICalendarProps extends HTMLProps<HTMLDivElement> {
  firstSelectedDay: Date | null;
  secondSelectedDay: Date | null;
  setFirstSelectedDay: Dispatch<SetStateAction<Date | null>>;
  setSecondSelectedDay: Dispatch<SetStateAction<Date | null>>;
}

const Calendar: FC<ICalendarProps> = ({
  firstSelectedDay,
  secondSelectedDay,
  setFirstSelectedDay,
  setSecondSelectedDay,
  ...props
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showedDate, setShowedDate] = useState<Date>(() => {
    const date = new Date();
    date.setDate(1);
    return date;
  });

  const calendarRef = useRef<HTMLDivElement>(null);

  const getMonthDays = (month: number, year: number) => {
    return new Date(year, month, 0).getDate();
  };

  const [days, setDays] = useState<number>(
    getMonthDays(showedDate.getMonth() + 1, showedDate.getFullYear())
  );

  const changeMonth = (value: number) => {
    const newDate = new Date(showedDate);
    newDate.setMonth(newDate.getMonth() + value);
    setShowedDate(newDate);
    setDays(getMonthDays(newDate.getMonth() + 1, newDate.getFullYear()));
  };

  const onCalendarWheel = (event: WheelEvent) => {
    event.preventDefault();
    if (event.deltaY > 0) {
      changeMonth(1);
    } else {
      changeMonth(-1);
    }
  };

  const selectDate = (date: Date) => {
    if (!firstSelectedDay) {
      date.setHours(0, 0, 0, 0);
      setFirstSelectedDay(date);
    } else if (firstSelectedDay && secondSelectedDay) {
      setFirstSelectedDay(date);
      setSecondSelectedDay(null);
    } else {
      if (firstSelectedDay < date) {
        date.setHours(23, 59, 59, 999);
        setSecondSelectedDay(date);
      } else {
        const temp = firstSelectedDay;
        date.setHours(0, 0, 0, 0);
        temp.setHours(23, 59, 59, 999);
        setFirstSelectedDay(date);
        setSecondSelectedDay(temp);
      }
    }
  };

  useEffect(() => {
    calendarRef &&
      calendarRef.current?.addEventListener(
        "wheel",
        (e) => onCalendarWheel(e),
        {
          passive: false,
        }
      );
    return () => {
      calendarRef?.current?.removeEventListener("wheel", (e) =>
        onCalendarWheel(e)
      );
    };
  }, [calendarRef, isExpanded, showedDate, days]);

  return (
    <div {...props} className={`${props.className} ${classes.container}`}>
      <button
        className={classes.calendarIcon}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <Image src={CalendarSvg} className={classes.calendar} alt="calendar" />
      </button>

      {isExpanded && (
        <div ref={calendarRef} className={classes.calendarContainer}>
          <div className={classes.monthSelect}>
            <button
              onClick={() => changeMonth(-1)}
              className={classes.monthButton}
            >
              <h3>&lt;</h3>
            </button>
            <button className={classes.monthButton}>
              <h3 className={classes.month}>
                {showedDate.toLocaleString("en", { month: "long" })}
              </h3>
              <h3>,&nbsp;</h3>
              <h3>{showedDate.getFullYear()}</h3>
            </button>
            <button
              onClick={() => changeMonth(1)}
              className={classes.monthButton}
            >
              <h3>&gt;</h3>
            </button>
          </div>

          {Object.values(DayOfWeek).map((day) => (
            <p key={day} className={classes.weekDay}>
              {day.slice(0, 2)}
            </p>
          ))}
          {Array.from({ length: days }).map((_, index) => {
            let day =
              showedDate.getDay() +
              index -
              Math.floor((showedDate.getDay() + index) / 7) * 7;
            const shift =
              Math.floor(
                (index -
                  1 +
                  (showedDate.getDay() === 0 ? 7 : showedDate.getDay())) /
                  7
              ) + 3;

            day <= 0 && (day += 7);
            return (
              <p
                onClick={() =>
                  selectDate(
                    new Date(
                      showedDate.getFullYear(),
                      showedDate.getMonth(),
                      index + 1
                    )
                  )
                }
                key={index}
                className={`${classes.day}${
                  new Date().getDate() === index + 1 &&
                  new Date().getMonth() === showedDate.getMonth() &&
                  new Date().getFullYear() === showedDate.getFullYear()
                    ? " " + classes.today
                    : ""
                }${
                  firstSelectedDay &&
                  secondSelectedDay &&
                  firstSelectedDay.getDate() === index + 1 &&
                  firstSelectedDay.getMonth() === showedDate.getMonth() &&
                  firstSelectedDay.getFullYear() === showedDate.getFullYear() &&
                  !(
                    firstSelectedDay.getDate() ===
                      secondSelectedDay.getDate() &&
                    firstSelectedDay.getMonth() ===
                      secondSelectedDay.getMonth() &&
                    firstSelectedDay.getFullYear() ===
                      secondSelectedDay.getFullYear()
                  )
                    ? " " + classes.selectedLeft
                    : ""
                }${
                  firstSelectedDay &&
                  secondSelectedDay &&
                  secondSelectedDay.getDate() === index + 1 &&
                  secondSelectedDay.getMonth() === showedDate.getMonth() &&
                  secondSelectedDay.getFullYear() ===
                    showedDate.getFullYear() &&
                  !(
                    firstSelectedDay.getDate() ===
                      secondSelectedDay.getDate() &&
                    firstSelectedDay.getMonth() ===
                      secondSelectedDay.getMonth() &&
                    firstSelectedDay.getFullYear() ===
                      secondSelectedDay.getFullYear()
                  )
                    ? " " + classes.selectedRight
                    : ""
                }${
                  firstSelectedDay &&
                  firstSelectedDay.getDate() === index + 1 &&
                  firstSelectedDay.getMonth() === showedDate.getMonth() &&
                  firstSelectedDay.getFullYear() === showedDate.getFullYear() &&
                  !(
                    secondSelectedDay &&
                    firstSelectedDay.getDate() ===
                      secondSelectedDay.getDate() &&
                    firstSelectedDay.getMonth() ===
                      secondSelectedDay.getMonth() &&
                    firstSelectedDay.getFullYear() ===
                      secondSelectedDay.getFullYear()
                  )
                    ? " " + classes.selected
                    : ""
                }${
                  firstSelectedDay &&
                  secondSelectedDay &&
                  firstSelectedDay.getDate() === secondSelectedDay.getDate() &&
                  firstSelectedDay.getMonth() ===
                    secondSelectedDay.getMonth() &&
                  firstSelectedDay.getFullYear() ===
                    secondSelectedDay.getFullYear() &&
                  firstSelectedDay.getDate() === index + 1 &&
                  firstSelectedDay.getMonth() === showedDate.getMonth() &&
                  firstSelectedDay.getFullYear() === showedDate.getFullYear()
                    ? " " + classes.selectedBoth
                    : ""
                }${
                  (firstSelectedDay &&
                    secondSelectedDay &&
                    firstSelectedDay.getDate() < index + 1 &&
                    secondSelectedDay.getDate() > index + 1 &&
                    firstSelectedDay.getMonth() === showedDate.getMonth() &&
                    secondSelectedDay.getMonth() === showedDate.getMonth() &&
                    secondSelectedDay.getFullYear() ===
                      showedDate.getFullYear()) ||
                  (firstSelectedDay &&
                    secondSelectedDay &&
                    firstSelectedDay.getMonth() < showedDate.getMonth() &&
                    firstSelectedDay.getFullYear() <=
                      showedDate.getFullYear() &&
                    secondSelectedDay.getMonth() === showedDate.getMonth() &&
                    secondSelectedDay.getFullYear() ===
                      showedDate.getFullYear() &&
                    secondSelectedDay.getDate() > index + 1) ||
                  (firstSelectedDay &&
                    secondSelectedDay &&
                    firstSelectedDay.getMonth() < showedDate.getMonth() &&
                    firstSelectedDay.getFullYear() <=
                      showedDate.getFullYear() &&
                    secondSelectedDay.getMonth() === showedDate.getMonth() &&
                    secondSelectedDay.getFullYear() ===
                      showedDate.getFullYear() &&
                    secondSelectedDay.getDate() > index + 1) ||
                  (firstSelectedDay &&
                    secondSelectedDay &&
                    firstSelectedDay.getMonth() === showedDate.getMonth() &&
                    firstSelectedDay.getFullYear() ===
                      showedDate.getFullYear() &&
                    secondSelectedDay.getMonth() > showedDate.getMonth() &&
                    secondSelectedDay.getFullYear() >=
                      showedDate.getFullYear() &&
                    firstSelectedDay.getDate() < index + 1)
                    ? " " + classes.between
                    : ""
                }`}
                style={{
                  gridArea: `${shift} / ${day}`,
                }}
              >
                {index + 1}
              </p>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Calendar;
