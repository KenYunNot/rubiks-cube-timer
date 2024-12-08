"use client";

import React from "react";
import Scramble from "./scramble";
import { cn } from '@/app/lib/utils';


const Timer = ({
  readyTime,
  inspection,
  scrambleSize,
  onStart = () => {},
  onStop = () => {},
  onInterrupt = () => {},
} : {
  readyTime: number,
  inspection: boolean,
  scrambleSize: number,
  onStart?: () => void,
  onStop?: () => void,
  onInterrupt?: () => void,
}) => {
  const [displayParts, setDisplayParts] = React.useState<string[]>(["0", "00"]);
  const [status, setStatus] = React.useState<"idle" | "starting" | "inspection" | "waiting" | "ready" | "solving" | "finished">("idle");
  const inspectionInterval = React.useRef<NodeJS.Timeout>();
  const solvingInterval = React.useRef<NodeJS.Timeout>();

  const waitingInterval = React.useRef<NodeJS.Timeout>();
  const intervalFn = () => {
    setStatus("ready");
    clearInterval(waitingInterval.current);
  }

  const handleKeyDown = (e: any) => {
    // Skip repeat keyboard events
    if (e.repeat) return;
    // 'Escape' key
    if (e.key === 'Escape') {
      setStatus("idle");
      onInterrupt();
      return;
    }
    // 'Space' key
    if (e.key !== ' ') return;
    if (inspection) {
      switch (status) {
        case "idle":
          setStatus("starting");
          onStart();
          break;
        case "inspection":
          setStatus("waiting");
          waitingInterval.current = setInterval(intervalFn, readyTime);
          break;
        case "solving":
          setStatus("finished");
          onStop();
          break;
      }
    } else {
      switch (status) {
        case "idle":
          setStatus("waiting");
          waitingInterval.current = setInterval(intervalFn, readyTime);
          break;
        case "solving":
          setStatus("finished");
          break;
      }
    }
  }

  const handleKeyUp = (e: any) => {
    // Skip repeat keyboard events
    if (e.repeat) return;
    // 'Space' key
    if (e.key !== ' ') return;
    if (inspection) {
      switch (status) {
        case "starting":
          setStatus("inspection");
          let time = 15;
          setDisplayParts([String(time)]);
          inspectionInterval.current = setInterval(() => {
            time -= 1;
            if (time <= -2) {
              setDisplayParts(["DNF"]);
            } else if (time <= 0) {
              setDisplayParts(["+2"]);
            } else {
              setDisplayParts([String(time)]);
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
            const newDisplayParts = generateDisplayParts(startTime, currentTime);
            setDisplayParts(newDisplayParts);
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
            const newDisplay = generateDisplayParts(startTime, currentTime);
            setDisplayParts(newDisplay);
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
    <div className="flex flex-col w-full h-full">
      <Scramble scrambleSize={scrambleSize} />
      <div className={cn("flex justify-center items-center h-full", {
        "text-black" : status === "idle" || status === "solving",
        "text-red-500" : status === "inspection" || status === "finished",
        "text-yellow-400" : status === "waiting",
        "text-green-400" : status === "starting" || status === "ready",
      })}>
        <div className="flex items-end h-fit align-baseline text-[375px]">
          {displayParts.map((displayPart, index) => {
            if (index === 0) {
              return (
                <div key={index} className="leading-none min-w-[275px]">
                  {displayPart}
                </div>
              )
            }

            return (
              <div key={index} className="leading-none w-[550px] last:w-[450px] last:text-[300px]">
                {cn({
                  ':' : index !== displayParts.length-1,
                  '.' : index === displayParts.length-1,
                })}
                {displayPart}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}


const generateDisplayParts = (startTime: number, endTime: number) => {
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


export default React.memo(Timer);