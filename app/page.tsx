"use client";

import { useState } from "react";
import Timer from "@/app/ui/timer";


type Settings = {
  readyTime: number;
  inspection: boolean;
  scrambleSize: number,
}

export default function Home() {
  const [settings, setSettings] = useState<Settings>({
    readyTime: 300,
    inspection: true,
    scrambleSize: 15,
  })

  return (
    <div className="w-full h-full">
      <Timer 
        readyTime={settings.readyTime} 
        inspection={settings.inspection}
        scrambleSize={settings.scrambleSize}
      />
    </div>
  )
}