"use client";

import { useState, useEffect, useRef } from "react";
import Timer from "./ui/timer"
import Scramble from "./ui/scramble";
import Solves from "./ui/solves";
import { 
  generateScramble,
} from "./lib/utils";
import { 
  IDLE,
  STARTING,
  INSPECTION,
  WAITING,
  READY,
  SOLVING,
  FINISHED,
  INTERRUPTED,
  PREV,
  CURR
} from "./lib/definitions";
import { StatusContext } from "./context/statusContext";
import { ScramblesContext, ScramblePointerContext } from "./context/scrambleContext";
import { SolvesContext } from "@/app/context/solvesContext";

export default function Page() {
  const [_status, _setStatus] = useState<string>(IDLE); // Dummy status to rerender the page
  const [scrambles, setScrambles] = useState<string[]>(["", ""]);
  const [scramblePointer, setScramblePointer] = useState<number>(PREV);
  const [solves, setSolves] = useState<any[]>([]);
  const [fadeout, setFadeout] = useState<boolean>(false);

  const status = useRef<string>(IDLE); // Current status of the timer (must be a ref so event listener is functional)
  const setStatus = (s: string) => {_setStatus(s); status.current = s;} // Mutate function that changes dummy state and status ref

  const readyInterval = useRef<NodeJS.Timeout>();
  const readyTime = useRef<number>(300);


  /* On page load useEffect */
  useEffect(() => {
    // Event listeners
    // keydown event
    addEventListener("keydown", (event) => {
      if (event.repeat) return;
      if (event.key === ' ') {
        switch (status.current) {
          case IDLE:
            setStatus(STARTING);
            setFadeout(true);
            break;
          case INSPECTION:
            setStatus(WAITING);
            let intervalId = setInterval(() => {
              clearInterval(intervalId);
              setStatus(READY);
            }, readyTime.current);
            readyInterval.current = intervalId;
            break;
          case SOLVING:
            setStatus(FINISHED);
            setFadeout(false);
            break;
          default:
            console.log(`Invalid keydown event ${status.current}`);
            break;
        }
      } else if (event.key === 'Escape') {
        setStatus(INTERRUPTED);
        clearInterval(readyInterval.current);
        setFadeout(false);
      }
    });
    
    // keyup event
    addEventListener("keyup", (event) => {
      if (event.repeat) return;
      if (event.key === ' ') {
        switch (status.current) {
          case STARTING:
            setStatus(INSPECTION);
            break;
          case WAITING:
            clearInterval(readyInterval.current);
            setStatus(INSPECTION);
            break;
          case READY:
            setStatus(SOLVING);
            break;
          case FINISHED:
            setStatus(IDLE);
            break;
          default:
            console.log(`Invalid keyup event ${status.current}`);
            break;
        } 
      } else if (event.key === 'Escape') {
        setStatus(IDLE);
      }
    });
  }, []);


  return (
    <StatusContext.Provider value={{status: status.current, setStatus}}>
      <ScramblesContext.Provider value={{scrambles, setScrambles}}>
        <ScramblePointerContext.Provider value={{scramblePointer, setScramblePointer}}>
          <SolvesContext.Provider value={{solves, setSolves}}>
            <div className="h-screen flex">
              <Solves fadeout={fadeout} />
              <div className="w-full flex flex-col items-center">
                <Scramble fadeout={fadeout} />
                <Timer />
              </div>
            </div>
          </SolvesContext.Provider>
        </ScramblePointerContext.Provider>
      </ScramblesContext.Provider>
    </StatusContext.Provider>
  )
}