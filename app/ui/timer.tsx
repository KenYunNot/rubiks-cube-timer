"use client";

import { useState, useEffect, useRef, useContext } from "react";
import { generateDisplay } from "@/app/lib/utils";
import { StatusContext, SettingsContext } from "@/app/contexts";
import clsx from "clsx";

export default function Timer() {
  
  return (
    <div className="flex flex-col justify-center items-center w-full h-full">
      <Display />
    </div>
  )
}

function Display() {
  const status = useContext(StatusContext);
  const settings = useContext(SettingsContext);
  const [display, setDisplay] = useState<string[]>(["0", "00"]);
  const inspectionInterval = useRef<NodeJS.Timeout>();
  const solvingInterval = useRef<NodeJS.Timeout>();

  useEffect(() => {
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
    } else if (status === "solving") {
      clearInterval(inspectionInterval.current);
      const startTime = Date.now();
      solvingInterval.current = setInterval(() => {
        const currentTime = Date.now();
        const newDisplay = generateDisplay(startTime, currentTime);
        setDisplay(newDisplay);
      }, 10);
    } else if (status === "finished") {
      clearInterval(solvingInterval.current);
      inspectionInterval.current = undefined;
    }
  }, [status])

  function resetDisplay() {
    setDisplay(["0", "00"]);
  }

  let displayStyle = clsx(
    "display-font",
    {
      "text-black" : status === "idle" || status === "solving",
      "text-red-500" : status === "inspection" || status === "finished" || (status === "waiting" && !settings.useInspection),
      "text-yellow-400" : status === "waiting" && settings.useInspection,
      "text-green-400" : status === "starting" || status === "ready",
    }
  );

  return (
    <div className={displayStyle}>
      {display.map((displayPart, index) => {
        if (index === 0) {
          return (
            <span key={index}>{displayPart}</span>
          );
        }
        if (index === display.length-1) {
          return (
            <span key={index} className="centisecond">.{displayPart}</span>
          )
        }
        return (
          <span key={index}>:{displayPart}</span>
        )
      })}
    </div>
  )
}