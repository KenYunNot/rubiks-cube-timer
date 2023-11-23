/* 
  Builds the JSX for the display
*/
export function buildDisplayElement(display: string | string[]) {
  if (typeof display === 'string') {
    return display;
  }
  return display.map((part, index) => {
    if (index === 0) {
      return part;
    } else if (index < display.length-1) {
      return <span key={index}>:{part}</span>;
    } else {
      return <span className="text-7xl" key={index}>.{part}</span>
    }
  });
}


/*
  Returns the interval id and manages the display for the inspection
*/
export function startInspectionTimer(setDisplay: any, status: any) {
  console.log("Starting inspection", status);
  // The user always has 15 seconds for inspection
  let inspectionTime = 15;
  setDisplay(inspectionTime.toString());
  let intervalId = setInterval(() => {
    inspectionTime -= 1;
    // After 17 (or inspectionTime === -2) seconds, the solve is deemed a DNF (did not finish)
    // After 15 (or inspectionTime === 0) seconds, the solve is given a 2 second penalty (+2)
    if (inspectionTime <= -2) {
      setDisplay("DNF");
    } else if (inspectionTime <= 0) {
      setDisplay("+2");
    } else {
      setDisplay(inspectionTime.toString());
    }
  }, 1000)
  return intervalId;
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
  setDisplay(["0", "00"]);
  let intervalId = setInterval(() => {
    // Log the end time every 10 milliseconds
    let endTime = Date.now();
    let timeElapsed = endTime - startTime;
    // Edge case: if the time is less than one second, seconds are represented with a "0"
    if (timeElapsed < SECOND) {
      setDisplay(["0", Math.trunc(timeElapsed / CENTISECOND).toString().padStart(2, '0')]);
      return;
    }
    // Find the largest unit that fits into timeElapsed
    let start = 0;
    while (UNITS[start] > timeElapsed)
      start++;
    // Split timeElapsed into its parts
    let display = [];
    for (let i = start; i < UNITS.length; i++) {
      // If the current unit is greater than the timeElapsed, continue
      // Else, the current unit is less than timeElapsed
      //   If the display is currently empty, this is the first unit and do not pad with zeroes
      //   Else, this is not the first unit and pad with zeroes
      let unit = UNITS[i];
      if (display.length === 0) {
        display.push(Math.trunc(timeElapsed / unit).toString());
      } else {
        display.push(Math.trunc(timeElapsed / unit).toString().padStart(2, '0'));
      }
      setDisplay(display);
      timeElapsed %= unit;
    }
  }, 10);
  return intervalId;
}