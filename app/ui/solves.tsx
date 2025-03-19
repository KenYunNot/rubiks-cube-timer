import React from 'react'

import './styles.css';

export type Solve = {
  solveTime: number[];
  dnf: boolean;
  plus2: boolean;
  scramble: string;
  date: Date;
  comment?: string;
}

type SolvesProps = {
  solves: Solve[];
}

const Solves = ({ solves }: SolvesProps) => {
  const [bestSolve, setBestSolve] = React.useState<Solve>();
  const [currentSolve, setCurrentSolve] = React.useState<Solve>();

  React.useEffect(() => {
    if (solves.length === 0)
      setBestSolve(undefined);
    else
      setBestSolve(solves.reduce((a, b) => a.solveTime < b.solveTime ? a : b, solves[0]));
  }, [solves])

  return (
    <div className='absolute top-1/2 -translate-y-1/2 mx-8 p-8 w-[350px] h-5/6 bg-white border-2 border-lightgray rounded-lg'>
      <table className='w-full'>
        <thead>
          <tr>
            <th></th>
            <th className='column-header'>current</th>
            <th className='column-header'>best</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th className='row-header'>time</th>
            <td id='current-time'>{currentSolve ? currentSolve.solveTime : '-'}</td>
            <td id='best-time'>{bestSolve ? bestSolve.solveTime : '-'}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default Solves