import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
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