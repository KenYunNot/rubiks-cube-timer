"use client";

import React from "react";
import { generateDisplay } from "@/app/lib/utils";
import { StatusContext, SettingsContext } from "@/app/lib/contexts";
import clsx from "clsx";
import type { Status, Settings } from "@/app/lib/definitions";

type TimerProps = {
  status: Status;
  settings: Settings;
}

export default function Timer({
  status,
  settings,
} : TimerProps) {
  const [display, setDisplay] = React.useState<string[]>(["0", "00"]);
  const inspectionInterval = React.useRef<NodeJS.Timeout>();
  const solvingInterval = React.useRef<NodeJS.Timeout>();

  React.useEffect(() => {
    /* idle status */
    if (status === "idle") {
      clearInterval(inspectionInterval.current);
      clearInterval(solvingInterval.current);
    }
    /* inspection status */
    if (status === "inspection") {
      // If the inspection timer is already started, don't create another one
      if (inspectionInterval.current !== undefined) return;
      let time = 15;
      setDisplay([String(time)]);
      inspectionInterval.current = setInterval(() => {
        time -= 1;
        if (time <= -2) {
          setDisplay(["DNF"]);
        } else if (time <= 0) {
          setDisplay(["+2"]);
        } else {
          setDisplay([String(time)]);
        }
      }, 1000);
    }
    /* solving status */
    if (status === "solving") {
      clearInterval(inspectionInterval.current);
      const startTime = Date.now();
      solvingInterval.current = setInterval(() => {
        const currentTime = Date.now();
        const newDisplay = generateDisplay(startTime, currentTime);
        setDisplay(newDisplay);
      }, 10);
    }
    /* finished status */
    if (status === "finished") {
      clearInterval(solvingInterval.current);
      inspectionInterval.current = undefined;
    }
  }, [status])

  return (
    <div className="flex flex-col justify-center items-center w-full h-full">
      <div className={clsx("text-[375px]", {
        "text-black" : status === "idle" || status === "solving",
        "text-red-500" : status === "inspection" || status === "finished" || (status === "waiting" && !settings.useInspection),
        "text-yellow-400" : status === "waiting" && settings.useInspection,
        "text-green-400" : status === "starting" || status === "ready",
      })}>
        {display.map((displayPart, index) => {
          if (index === 0) {
            return (
              <span key={index}>{displayPart}</span>
            );
          }
          if (index === display.length-1) {
            return (
              <span key={index} className="text-[300px]">.{displayPart}</span>
            )
          }
          return (
            <span key={index}>:{displayPart}</span>
          )
        })}
      </div>
    </div>
  )
}