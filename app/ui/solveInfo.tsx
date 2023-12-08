import { useContext } from "react";
import Image from "next/image";
import { SolvesContext } from "@/app/context/solvesContext";
import { 
  buildTimerElement,
  removeSolveByIndex,
  updateSolveByIndex,
} from "@/app/lib/utils";
import clsx from "clsx";


export default function SolveInfo({
  solveDisplayed,
  closeSolveWindow,
}: {
  solveDisplayed?: number;
  closeSolveWindow: any;
}) {
  let { solves, setSolves } = useContext(SolvesContext);

  if (solveDisplayed === undefined) return <div className="hidden"></div>;
  
  // Declare variables for solve and information for easy accessibility
  const solveIndex = solveDisplayed-1;
  const solve = solves[solveIndex]; 
  const timerString = buildTimerElement(solve.timer); //
  const scramble = solve.scramble;
  const DNF = solve.DNF;
  const plusTwo = solve.plusTwo;


  function removeSolve() {
    if (confirm(`Delete solve #${solveDisplayed}?`)) {
      setSolves(removeSolveByIndex(solveIndex));
      closeSolveWindow();
    }
  }

  function updateSolve(_DNF: boolean, _plusTwo: boolean) {
    setSolves(updateSolveByIndex(solveIndex, _DNF, _plusTwo));
  }

  
  return (
    <div className="absolute w-screen h-screen top-0 left-0 flex items-center justify-center bg-opacity-30 bg-gray-700 z-10">
      <div className="flex flex-col justify-between items-center w-1/2 h-1/2 bg-white rounded-md">
        <h1 className="w-full py-7 text-center text-5xl font-semibold bg-blue-200 rounded-t-md">Solve #{solveDisplayed}</h1>
        <div>
          <p className="text-center text-8xl font-bold">{timerString}</p>
          <p className="mt-5 text-center text-3xl">{scramble}</p>
          <div className="w-full mt-5 flex justify-center">
            <button
              className={clsx("text-xl", {"bg-red-300 hover:bg-white hover:text-red-500" : !DNF}, {"bg-green-300 hover:bg-white hover:text-green-600" : DNF})}
              onClick={() => updateSolve(!DNF, false)}
            >
              DNF
            </button>
            <button 
              className={clsx("text-xl", {"bg-red-300 hover:bg-white hover:text-red-500" : !plusTwo}, {"bg-green-300 hover:bg-white hover:text-green-600" : plusTwo})}
              onClick={() => updateSolve(false, !plusTwo)}
            >
              +2
            </button>
            <button 
              id="garbage-button"
              className="relative p-0 w-fit h-fit bg-red-300 hover:bg-white hover:text-red-500"
              onClick={removeSolve}
            >
              <Image
                id="garbage-svg"
                className="py-1.5 px-1.5"
                src="/garbage.svg" 
                height={32}
                width={32}
                alt="Clear single solve button garbage can image"
              />
              <Image
                id="garbage-svg-red"
                className="py-1.5 px-1.5 hidden"
                src="/garbage-red.svg" 
                height={32}
                width={32}
                alt="Clear single solve button garbage can image"
              />
            </button>
          </div>
        </div>
        <button 
          className="w-fit mb-5 px-1.5 bg-blue-200 hover:bg-white hover:text-blue-500"
          onClick={closeSolveWindow}
        >
          Close
        </button>
      </div>
    </div>
  );
}
