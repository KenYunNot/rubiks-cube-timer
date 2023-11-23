// Builds the string for the timer display
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


// Returns the interval id for the inspection
export function startInspection(setDisplay: any) {
  let inspectionTime = 15;
  setDisplay(inspectionTime.toString());
  let intervalId = setInterval(() => {
    inspectionTime -= 1;
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