import { useEffect, useContext } from "react";
import { generateScramble } from "@/app/lib/utils";
import { 
  FINISHED, 
  PREV, 
  CURR,
} from "@/app/lib/definitions";
import { StatusContext } from "../context/statusContext";
import { ScramblesContext, ScramblePointerContext } from "@/app/context/scrambleContext";
import clsx from "clsx";


export default function Scramble({ fadeout } : { fadeout: boolean}) {
  let { status } = useContext(StatusContext);
  let { scrambles, setScrambles } = useContext(ScramblesContext);
  let { scramblePointer, setScramblePointer } = useContext(ScramblePointerContext);


  /* On page load useEffect */
  useEffect(() => {
    setScrambles([generateScramble(), generateScramble()]);
  }, [])
  
  
  /* On FINISHED status useEffect */
  useEffect(() => {
    if (status !== FINISHED) return;
    setScrambles([scrambles[scramblePointer], generateScramble()])
    setScramblePointer(CURR);
  }, [status]);


  /* 'prev' and 'next' button logic */
  function onPrev() {
    if (scramblePointer === PREV) return;
    setScramblePointer(PREV);
  }

  function onNext() {
    if (scramblePointer === PREV) setScramblePointer(CURR);
    else setScrambles([scrambles[scramblePointer], generateScramble()]);
  }


  return (
    <div id="scramble-div" className={clsx("flex flex-col items-center mt-5 hide-on-starting", {"fadeout" : fadeout === true})}>
      <p className="text-6xl">{scrambles[scramblePointer]}</p>
      <div className="buttons-container m-5">
        <button 
          id="prev-button" 
          className={clsx({"text-2xl bg-gray-200 text-gray-600 hover:pointer-events-none" : scramblePointer === PREV}, {"text-2xl bg-red-300 hover:bg-white hover:text-red-500" : scramblePointer === CURR})} 
          onClick={() => onPrev()}
          disabled={scramblePointer === PREV}
        >
          Prev
        </button>
        <button id="next-button" className="text-2xl next bg-green-200 hover:bg-white hover:text-green-600" onClick={() => onNext()}>Next</button>
      </div>
    </div>
  )
}