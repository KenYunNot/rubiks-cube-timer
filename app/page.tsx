"use client";

import { useState, useEffect, useRef } from "react";
import { Status, Settings } from "@/app/lib/definitions";
import Timer from "@/app/ui/timer";

export default function Home() {
  const [scramble, setScramble] = useState<string>();
  const [settings, setSettings] = useState<Settings>({
    readyTime: 300,
    scrambleSize: 15,
    useInspection: true,
  });

  return (
    <div className="w-full h-full">
      <Timer settings={settings} />
    </div>
  )
}