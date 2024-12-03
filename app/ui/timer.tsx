"use client";

import React from "react";
import clsx from "clsx";
import type { Status, Settings } from "@/app/lib/definitions";

type TimerProps = {
  settings: Settings;
}


const generateDisplay = (startTime: number, endTime: number) => {
  const DAY_MS = 86400000;
  const HOUR_MS = 3600000;
  const MINUTE_MS = 60000;
  const SECOND_MS = 1000;
  const CENTISECOND_MS = 10;

  let parts = [];
  let diff = endTime - startTime;
  if (diff > DAY_MS) {
    parts.push(Math.trunc(diff / DAY_MS));
  }
  if (diff > HOUR_MS) {
    parts.push(Math.trunc((diff % DAY_MS) / HOUR_MS));
  }
  if (diff > MINUTE_MS) {
    parts.push(Math.trunc((diff % HOUR_MS) / MINUTE_MS));
  }
  parts.push(Math.trunc((diff % MINUTE_MS) / SECOND_MS));
  parts.push(Math.trunc((diff % SECOND_MS) / CENTISECOND_MS));

  let display = [];
  for (let i = 0; i < parts.length; i++) {
    if (i === 0) {
      display.push(String(parts[i]));
    } else {
      display.push(String(parts[i]).padStart(2, '0'));
    }
  }
  return display;
}

export default function Timer({
  settings,
} : TimerProps) {
  const [display, setDisplay] = React.useState<string[]>(["0", "00"]);
  const [status, setStatus] = React.useState<Status>("idle");
  const inspectionInterval = React.useRef<NodeJS.Timeout>();
  const solvingInterval = React.useRef<NodeJS.Timeout>();

  const waitingInterval = React.useRef<NodeJS.Timeout>();
  const intervalFn = () => {
    setStatus("ready");
    clearInterval(waitingInterval.current);
  }

  const handleKeyDown = (e: any) => {
    // Handle 'Escape' events separately
    if (e.key === 'Escape') {
      setStatus("idle");
    }
    // Ignore events that are not space (except Escape) and those that repeat
    if (e.key !== ' ' || e.repeat) return;
    if (settings.useInspection) {
      switch (status) {
        case "idle":
          setStatus("starting");
          break;
        case "inspection":
          setStatus("waiting");
          waitingInterval.current = setInterval(intervalFn, settings.readyTime);
          break;
        case "solving":
          setStatus("finished");
          break;
      }
    } else {
      switch (status) {
        case "idle":
          setStatus("waiting");
          waitingInterval.current = setInterval(intervalFn, settings.readyTime);
          break;
        case "solving":
          setStatus("finished");
          break;
      }
    }
  }

  const handleKeyUp = (e: any) => {
    // Ignore events that are not space and those that repeat
    if (e.key !== ' ' || e.repeat) return;
    if (settings.useInspection) {
      switch (status) {
        case "starting":
          setStatus("inspection");
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
          break;
        case "waiting":
          setStatus("inspection");
          clearInterval(waitingInterval.current);
          break;
        case "ready":
          setStatus("solving");
          clearInterval(inspectionInterval.current);
          const startTime = Date.now();
          solvingInterval.current = setInterval(() => {
            const currentTime = Date.now();
            const newDisplay = generateDisplay(startTime, currentTime);
            setDisplay(newDisplay);
          }, 10);
          break;
        case "finished":
          setStatus("idle");
          clearInterval(solvingInterval.current);
          break;
      }
    } else {
      switch (status) {
        case "waiting":
          setStatus("idle");
          clearInterval(waitingInterval.current);
          break;
        case "ready":
          setStatus("solving");
          clearInterval(inspectionInterval.current);
          const startTime = Date.now();
          solvingInterval.current = setInterval(() => {
            const currentTime = Date.now();
            const newDisplay = generateDisplay(startTime, currentTime);
            setDisplay(newDisplay);
          }, 10);
          break;
        case "finished":
          setStatus("idle");
          clearInterval(solvingInterval.current);
          break;
      }
    }
  }

  React.useEffect(() => {
    addEventListener("keydown", handleKeyDown);
    addEventListener("keyup", handleKeyUp);

    return () => {
      removeEventListener("keydown", handleKeyDown);
      removeEventListener("keyup", handleKeyUp)
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