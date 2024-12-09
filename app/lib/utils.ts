import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
}

export const generateDisplayParts = (startTime: number, endTime: number) => {
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

export const generateScramble = (scrambleSize: number) => {
  const faces = ['U', 'D', 'R', 'L', 'F', 'B'];
  const modifiers = ['', '2', '\''];
  let scramble = "";
  let prevFace = "";
  for (let i = 0; i < scrambleSize; i++) {
    let face = faces[Math.floor(Math.random() * faces.length)];
    while (face === prevFace) 
      face = faces[Math.floor(Math.random() * faces.length)];
    let modifier = modifiers[Math.floor(Math.random() * modifiers.length)];
    scramble += face + modifier + ' ';
    prevFace = face;
  }
  return scramble.slice(0, -1);
}