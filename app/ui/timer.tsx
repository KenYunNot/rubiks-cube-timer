"use client";

import { useState, useEffect, useRef, MutableRefObject } from "react";
import { buildDisplayElement, startInspectionTimer, startSolveTimer } from "@/app/lib/utils"


const BLACK = "text-black";
const RED = "text-red-500";
const YELLOW = "text-yellow-400";
const GREEN = "text-green-500";

const IDLE = "IDLE";
const STARTING = "STARTING"
const INSPECTION = "INSPECTION";
const READY = "READY";
const SOLVING = "SOLVING";
const FINISHED = "FINISHED";

export default function Timer() {
  const [display, setDisplay] = useState<string | string[]>(["0", "00"]); // string means inspection state, string[] means timer state
  const [displayColor, setDisplayColor] = useState<string>(BLACK); // Current color of the display, uses constants defined as the tailwind color classes

  const status = useRef<string>(IDLE); // Current status of the timer, uses constants defined as their string representations
  const readyTime = useRef<number>(300); // How long the user must hold down the space bar in milliseconds to start the solve 

  const setStatus = (newStatus: string) => status.current = newStatus; // Mutate function for status ref object

  const inspectionInterval = useRef<NodeJS.Timeout | undefined>(undefined); // Interval used for the inspection
  const readyTimeInterval = useRef<NodeJS.Timeout | undefined>(undefined); // Interval used to verify if the user held down the space bar for the minimum time
  const solveInterval = useRef<NodeJS.Timeout | undefined>(undefined); // Interval used for the solve

  useEffect(() => {
    // 'keydown' event listener
    addEventListener("keydown", (event) => {
      // ' ' (space bar) events
      if (event.key === ' ') {
        switch (status.current) {
          case IDLE:
            setDisplayColor(GREEN);
            setStatus(STARTING);
            break;
          case STARTING:
            break;
          case INSPECTION:
            setDisplayColor(YELLOW);
            let intervalId = setInterval(() => {
              clearInterval(intervalId);
              setDisplayColor(GREEN);
              setStatus(READY);
            }, readyTime.current);
            readyTimeInterval.current = intervalId;
            break;
          case READY:
            break;
          case SOLVING:
            clearInterval(solveInterval.current);
            setDisplayColor(RED);
            setStatus(FINISHED);
            break;
          case FINISHED:
            break;
        }
      }
    });

    // 'keyup' event listener
    addEventListener("keyup", (event) => {
      // ' ' (space bar) events
      if (event.key === ' ') {
        switch (status.current) {
          case IDLE:
            break;
          case STARTING:
            setDisplayColor(RED);
            let inspectionIntervalId = startInspectionTimer(setDisplay, status.current);
            inspectionInterval.current = inspectionIntervalId;
            setStatus(INSPECTION);
            break;
          case INSPECTION:
            clearInterval(readyTimeInterval.current);
            setDisplayColor(RED);
            break;
          case READY:
            clearInterval(inspectionInterval.current);
            setDisplayColor(BLACK);
            let solveIntervalId = startSolveTimer(setDisplay);
            solveInterval.current = solveIntervalId;
            setStatus(SOLVING);
          case SOLVING:
            break;
          case FINISHED:
            setDisplayColor(BLACK);
            setStatus(IDLE);
            break;
        }
      }
    });
  }, [])

  return (
    <div id="timer-display" className="flex justify-center">
      <p className={`text-9xl ${displayColor}`}>{buildDisplayElement(display)}</p>
    </div>
  );
}