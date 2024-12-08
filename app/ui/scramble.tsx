"use client";

import React from 'react'
import { cn } from '@/app/lib/utils';


const CURR = 0;
const PREV = 1;

const Scramble = ({
  scrambleSize,
} : {
  scrambleSize: number,
}) => {
  const [scrambleList, setScrambleList] = React.useState([generateScramble(scrambleSize), ""]);
  const [currScramble, setCurrScramble] = React.useState(CURR);

  const nextOnClick = () => {
    if (currScramble === PREV) {
      setCurrScramble(CURR);
    } else {
      setScrambleList(oldList => [generateScramble(scrambleSize), oldList[CURR]]);
    }
  }

  const prevOnClick = () => {
    setCurrScramble(PREV);
  }

  const buttonStyles = 'px-3 py-1 bg-blue-400 font-semibold rounded-full hover:bg-blue-500'
  
  return (
    <div className="flex flex-col justify-center items-center gap-3 w-full p-5">
      <div className='flex gap-3 h-fit'>
        <button 
          className={cn(buttonStyles, {'disabled pointer-events-none bg-gray-300' : currScramble === PREV})}
          onClick={prevOnClick}
        >
          prev
        </button>
        <button 
          className={buttonStyles}
          onClick={nextOnClick}
        >
          next
        </button>
      </div>
      <span className='text-5xl'>{scrambleList[currScramble]}</span>
    </div>
  )
}

const generateScramble = (scrambleSize: number) => {
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

export default Scramble