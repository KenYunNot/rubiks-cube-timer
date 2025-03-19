"use client";

import { useState } from "react";
import Timer from "@/app/ui/timer";
import Solves from "./ui/solves";
import type { Solve } from "./ui/solves";


type Settings = {
  readyTime: number;
  inspection: boolean;
  scrambleSize: number;
}

export default function Home() {
  const [settings, setSettings] = useState<Settings>({
    readyTime: 300,
    inspection: true,
    scrambleSize: 15,
  });
  const [solves, setSolves] = useState<Solve[]>([]);

  const addSolve = (solve: Solve) => {
    setSolves(prev => [solve, ...prev]);
  }

  return (
    <div className="relative w-full h-full">
      <Solves 
        solves={solves}
      />
      <Timer 
        readyTime={settings.readyTime} 
        inspection={settings.inspection}
        scrambleSize={settings.scrambleSize}
        onStop={addSolve}
      />
    </div>
  )
}