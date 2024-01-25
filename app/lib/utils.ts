
const unitsInMs : { [key: string] : number} = {
  day: 86400000,
  hour: 3600000,
  minute: 60000,
  second: 1000,
  centisecond: 10,
};
export function generateDisplay(startTime: number, endTime: number) {
  let parts = [];
  let diff = endTime - startTime;
  if (diff > unitsInMs.day) {
    parts.push(Math.trunc(diff / unitsInMs.day));
  }
  if (diff > unitsInMs.hour) {
    parts.push(Math.trunc((diff % unitsInMs.day) / unitsInMs.hour));
  }
  if (diff > unitsInMs.minute) {
    parts.push(Math.trunc((diff % unitsInMs.hour) / unitsInMs.minute));
  }
  parts.push(Math.trunc((diff % unitsInMs.minute) / unitsInMs.second));
  parts.push(Math.trunc((diff % unitsInMs.second) / unitsInMs.centisecond));

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