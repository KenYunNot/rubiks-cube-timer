"use client";

import { useState, useEffect, useRef, useContext } from "react";
import { 
  startInspectionTimer, 
  startSolveTimer,
  buildTimerElement,
  addSolve,
} from "@/app/lib/utils"
import {
  BLACK,
  RED,
  YELLOW,
  GREEN,
  IDLE,
  STARTING,
  INSPECTION,
  WAITING,
  READY,
  SOLVING,
  FINISHED,
  INTERRUPTED,
} from '@/app/lib/definitions';
import { StatusContext } from "@/app/context/statusContext";
import { ScramblesContext, ScramblePointerContext } from "@/app/context/scrambleContext";
import { SolvesContext } from "@/app/context/solvesContext";


export default function Timer() {
  let { status } = useContext(StatusContext); // Fetch value of status from Context Provider
  let { scrambles } = useContext(ScramblesContext); // Fetch scrambles from Scramble context provider
  let { scramblePointer } = useContext(ScramblePointerContext); // Fetch scramblePointer from ScramblePointer context provider
  let { setSolves } = useContext(SolvesContext) // Fetch solves and dispatch from Solves context provider

  const [timer, setTimer] = useState<string | number[]>([0,0,0,0,0]); // Currently displayed on the timer
  const [timerColor, setTimerColor] = useState<string>(BLACK); // Current color of the timer

  const inspectionInterval = useRef<NodeJS.Timeout | undefined>(undefined); // Interval ID for inspection interval (fires every second)
  const solveInterval = useRef<NodeJS.Timeout | undefined>(undefined); // Interval ID for solve interval (fires every centisecond)
  
  const DNF = useRef<boolean>(false);
  const plusTwo = useRef<boolean>(false);

  /* On status change useEffect */
  useEffect(() => {
    switch (status) {
      case IDLE:
        setTimerColor(BLACK);
        cleanTimer();
        break;
      case STARTING:
        setTimerColor(GREEN);
        break;
      case INSPECTION:
        if (!inspectionInterval.current) inspectionInterval.current = startInspectionTimer(setTimer, DNF, plusTwo);
        setTimerColor(RED);
        break;
      case WAITING:
        setTimerColor(YELLOW);
        break;
      case READY:
        setTimerColor(GREEN);
        break;
      case SOLVING:
        clearInterval(inspectionInterval.current);
        if (!solveInterval.current) solveInterval.current = startSolveTimer(setTimer);
        setTimerColor(BLACK);
        break;
      case FINISHED:
        let solveInfo = {
          timer,
          scramble: scrambles[scramblePointer],
          DNF: DNF.current,
          plusTwo: plusTwo.current,
        };
        setSolves(addSolve(solveInfo)); // Add solve to localStorage and manually on client
        clearInterval(solveInterval.current);
        setTimerColor(RED);
        break;
      case INTERRUPTED:
        resetDisplay();
        cleanTimer();
        break;
      default:
        console.log(`Invalid status ${status}.`);
        break;
    }
  }, [status]);

  
  function resetDisplay() {
    setTimer([0,0,0,0,0]);
  }

  function cleanTimer() {
    setTimerColor(BLACK);
    clearInterval(inspectionInterval.current);
    clearInterval(solveInterval.current);
    inspectionInterval.current = undefined;
    solveInterval.current = undefined;
    DNF.current = false;
    plusTwo.current = false;
  }


  return (
    <div id="timer-div" className="absolute top-1/4">
      <p id="timer" className={timerColor}>{buildTimerElement(timer)}</p>
    </div>
  );
}