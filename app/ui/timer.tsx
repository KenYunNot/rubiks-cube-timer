"use client";

import React from "react";
import { cn, generateDisplayParts, generateScramble } from '@/app/lib/utils';


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
  const [displayParts, setDisplayParts] = React.useState<string | number[]>([0, 0]);
  const [status, setStatus] = React.useState<"idle" | "starting" | "inspection" | "waiting" | "ready" | "solving" | "finished">("idle");
  const [scrambleList, setScrambleList] = React.useState([generateScramble(scrambleSize), ""]);
  const [isPrevScramble, setIsPrevScramble] = React.useState(false);
  const inspectionInterval = React.useRef<NodeJS.Timeout>();
  const solvingInterval = React.useRef<NodeJS.Timeout>();
  const waitingInterval = React.useRef<NodeJS.Timeout>();

  const resetTimer = () => {
    clearInterval(inspectionInterval.current);
    clearInterval(waitingInterval.current);
    clearInterval(solvingInterval.current);
    setDisplayParts([0, 0]);
  }

  const handleKeyDown = (e: any) => {
    // Skip repeat keyboard events
    if (e.repeat) return;
    // 'Escape' key
    if (e.key === 'Escape') {
      setStatus("idle");
      resetTimer();
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
          waitingInterval.current = setInterval(() => {
            setStatus("ready");
            clearInterval(waitingInterval.current);
          }, readyTime);
          break;
        case "solving":
          setStatus("finished");
          clearInterval(solvingInterval.current);
          onStop();
          break;
      }
    } else {
      switch (status) {
        case "idle":
          setStatus("waiting");
          waitingInterval.current = setInterval(() => {
            setStatus("ready");
            clearInterval(waitingInterval.current);
          }, readyTime);
          onStart();
          break;
        case "solving":
          setStatus("finished");
          clearInterval(solvingInterval.current);
          onStop();
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
          let time = 15;
          setStatus("inspection");
          setDisplayParts(String(time));
          inspectionInterval.current = setInterval(() => {
            time -= 1;
            if (time <= -2) {
              setDisplayParts("DNF");
            } else if (time <= 0) {
              setDisplayParts("+2");
            } else {
              setDisplayParts(String(time));
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
      <div id="scramble-div" className="flex flex-col justify-center items-center gap-3 w-full p-5">
        <div className='flex gap-3 h-fit'>
          <button 
            className={cn('px-3 py-1 bg-blue-400 font-semibold rounded-full hover:bg-blue-500', {
              'disabled pointer-events-none bg-gray-300' : isPrevScramble,
            })}
            onClick={() => setIsPrevScramble(true)}
          >
            prev
          </button>
          <button 
            className='px-3 py-1 bg-blue-400 font-semibold rounded-full hover:bg-blue-500'
            onClick={() => {
              if (isPrevScramble)
                setIsPrevScramble(false)
              else
                setScrambleList(prevList => [generateScramble(scrambleSize), prevList[0]])
            }}
          >
            next
          </button>
        </div>
        <span className='text-5xl'>{scrambleList[+ isPrevScramble]}</span>
      </div>
      <div id="timer-div" className={cn("flex justify-center items-center h-full", {
        "text-black" : status === "idle" || status === "solving",
        "text-red-500" : status === "inspection" || status === "finished",
        "text-yellow-400" : status === "waiting",
        "text-green-400" : status === "starting" || status === "ready",
      })}>
        <div className="flex items-end h-fit align-baseline text-[375px]">
          {typeof displayParts === 'string' ? displayParts : 
            displayParts.map((displayPart, index) => {
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
                  {String(displayPart).padStart(2, '0')}
                </div>
              )
            }
          )}
        </div>
      </div>
    </div>
  )
}


export default React.memo(Timer);