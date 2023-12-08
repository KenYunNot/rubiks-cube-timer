"use client";

import { useState, useEffect, useContext } from "react";
import {
  buildTimerElement,
  resetSolves,
  // clearSolveByIndex,
} from "@/app/lib/utils";
import SolveInfo from "./solveInfo";
import { SolvesContext } from "../context/solvesContext";
import clsx from "clsx";

export default function Solves({ fadeout } : { fadeout: boolean}) {
  let { solves, setSolves } = useContext(SolvesContext);
  const [solveDisplayed, setSolveDisplayed] = useState<number | undefined>(undefined);


  useEffect(() => {
    // Initialize localStorage keys
    let json = localStorage.getItem("solves");
    if (!json) localStorage.setItem("solves", JSON.stringify([]));
    else setSolves(JSON.parse(json));
  }, []);


  /* On click function to clear all solves locally and from local storage */
  function resetSolves() {
    if (confirm("Reset all solves?")) {
      setSolves(resetSolves()); // Reset solves on localStorage and locally on client
      console.log("Confirmed reset solves");
    }
  }

  /* Open and close functions for modal displaying solve information */
  function openSolveWindow(solveIndex: number) {
    setSolveDisplayed(solveIndex);
  }

  function closeSolveWindow() {
    setSolveDisplayed(undefined);
  }


  console.log("Rerendered solves.tsx");
  return (
    <div
      id="solves-div"
      className={clsx("flex flex-col w-96 m-2.5 p-2.5 items-center justify-start border-2 border-gray-300 rounded hide-on-starting", {"fadeout" : fadeout === true})}
    >
      <div className="relative flex w-full h-6 items-center">
        <p className="absolute text-2xl font-bold">Solves</p>
        <button 
          className="absolute right-0 bg-red-300 hover:bg-white hover:text-red-500"
          onClick={resetSolves}
        >
          Clear
        </button>
      </div>
      <table className="w-full m-4">
        <thead>
          <tr>
            <th>#</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {solves &&
            solves.toReversed().map((solve, i) => {
              let index = solves.length - i;
              return (
                <tr key={index}>
                  <td className="text-center">{index}</td>
                  <td className="pl-2.5 py-1">
                    <span 
                      className="hover:text-blue-400 hover:underline hover:cursor-pointer" 
                      onClick={() => openSolveWindow(index)}
                    >
                      {buildTimerElement(solve.timer)}
                    </span>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
      <SolveInfo solveDisplayed={solveDisplayed} closeSolveWindow={closeSolveWindow} />
    </div>
  );
}
