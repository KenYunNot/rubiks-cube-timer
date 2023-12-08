import { MutableRefObject } from "react";
import { Solve } from "@/app/lib/definitions";

/*
  Returns the interval id and manages the display for the inspection
*/
export function startInspectionTimer(setDisplay: any, DNF: MutableRefObject<boolean>, plusTwo: MutableRefObject<boolean>) {
  // The user always has 15 seconds for inspection
  let inspectionTime = 15;
  setDisplay(inspectionTime.toString());
  let intervalId = setInterval(() => {
    inspectionTime -= 1;
    // After 17 (or inspectionTime === -2) seconds, the solve is deemed a DNF (did not finish)
    // After 15 (or inspectionTime === 0) seconds, the solve is given a 2 second penalty (+2)
    if (inspectionTime <= -2) {
      setDisplay("DNF");
      plusTwo.current = false;
      DNF.current = true;
    } else if (inspectionTime <= 0) {
      setDisplay("+2");
      plusTwo.current = true;
    } else {
      setDisplay(inspectionTime.toString());
    }
  }, 1000)
  return intervalId;
}


/* 
  Builds and returns the display element in JSX 

  display is formatted as [day, hour, minute, second, centisecond]
*/
export function buildTimerElement(display: string | number[]) {
  // If display is type string, the timer is in inspection. Don't refactor the display
  if (typeof display === 'string') return display;
  let displayElement = [];
  // Only iterate until display.length-1 because centisecond is an edge case
  for (let i = 0; i < display.length-1; i++) {
    // Find the first non-zero display part
    if (display[i] === 0 && displayElement.length === 0) continue;
    // If it's the first part in the display, add it without padding
    // Else, add it with padding
    if (displayElement.length === 0) {
      displayElement.push(display[i].toString());
    } else {
      displayElement.push(`:${display[i].toString().padStart(2, "0")}`);
    }
  }
  // If displayElement is empty, the time elapsed is less than a second. Add seconds as a zero
  if (displayElement.length === 0 )
    displayElement.push("0");
  // Add the final part (centiseconds) with a period instead of a colon
  displayElement.push(<span id="centisecond" key="centisecond">.{display[display.length-1].toString().padStart(2, "0")}</span>);
  return displayElement;
}

/* 
  Returns the interval id and manages the display for the solve
*/
export function startSolveTimer(setDisplay: any) {
  // Units of time in milliseconds (max unit on our timer will be days)
  const DAY = 86400000;
  const HOUR = 3600000
  const MINUTE = 60000;
  const SECOND = 1000;
  const CENTISECOND = 10;
  const UNITS = [DAY, HOUR, MINUTE, SECOND, CENTISECOND]; // Used in our for loop
  // Log the start time and set the display to the default time
  let startTime = Date.now();
  setDisplay([0,0,0,0,0]);
  let intervalId = setInterval(() => {
    // Initialize variables
    let display = [];
    let endTime = Date.now();
    let timeElapsed = endTime - startTime;
    // Split timeElapsed into its parts 
    for (let unit of UNITS) {
      // Divide timeElapsed into its parts
      display.push(Math.trunc(timeElapsed / unit));
      timeElapsed %= unit;
    }
    setDisplay(display);
  }, 10);
  return intervalId;
}



/* 
  Helper function for generateScramble 
*/
function generateMove() {
  let moves = ["L", "L2", "L'", "R", "R2", "R'", "U", "U2", "U'", "D", "D2", "D'", "F", "F2", "F'", "B", "B2", "B'"];
  let index = Math.trunc(Math.random() * moves.length);
  let group = Math.trunc(index / 6);
  let move = moves[index];
  return [index, group, move];
}

/* 
  Generates a Rubik's cube scramble up to scrambleLength
*/
export function generateScramble(scrambleLength=15) {
  let scramble = "";
  let previousGroup;
  for (let i = 0; i < scrambleLength; i++) {
    let [index, group, move] = generateMove();
    while (group === previousGroup)
      [index, group, move] = generateMove();
    previousGroup = group;
    scramble += `${move}  `;
  }
  return scramble.slice(0, -2);
}


/* 
  Adds a single solve to solves data in localStorage, returns the new resulting array
*/
export function addSolve(solveInfo: Solve) {
  let json = localStorage.getItem("solves");
  let solves;
  if (!json) {
    solves = [];
  } else {
    solves = JSON.parse(json);
  }
  solves.push(solveInfo);
  localStorage.setItem("solves", JSON.stringify(solves));
  return solves;
}


/* 
  Clears all solves data from localStorage, returns the new resulting array
*/
export function resetSolves() {
  console.log("Reset the solves localStorage");
  localStorage.setItem("solves", JSON.stringify([]));
  return [];
}


/* Clear a single solve by index from localStorage */
export function removeSolveByIndex(solveIndex: number) {
  // Fetch from localStorage
  let json = localStorage.getItem("solves");
  if (!json) return;
  let solves = JSON.parse(json);
  // If the solveIndex is out of bounds, throw an error
  if (solves.length <= solveIndex) throw new Error("Solve index out of bounds");
  // Update and set new array without the deleted solve
  let newSolves = solves.slice(0, solveIndex).concat(solves.slice(solveIndex+1));
  // Update localStorage and return the result
  localStorage.setItem("solves", JSON.stringify(newSolves));
  return newSolves;
}


/* Update a single solve by index from localStorage */
export function updateSolveByIndex(solveIndex: number, DNF: boolean, plusTwo: boolean) {
    // Fetch from localStorage
    let json = localStorage.getItem("solves");
    if (!json) return;
    let solves = JSON.parse(json);
    // If the solveIndex is out of bounds, throw an error
    if (solves.length <= solveIndex) throw new Error("Solve index out of bounds");
    let solve = solves[solveIndex];
    // Update the penalties with their new values
    solve.DNF = DNF;
    solve.plusTwo = plusTwo;
    // Put the updated solve into a new array
    let newSolves = solves.slice(0, solveIndex).concat([solve], solves.slice(solveIndex+1));
    // Update localStorage and return the result
    localStorage.setItem("solves", JSON.stringify(newSolves));
    return newSolves;
}