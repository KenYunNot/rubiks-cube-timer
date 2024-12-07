"use client";

import { useState } from "react";
import Scramble from "@/app/ui/scramble";
import Timer from "@/app/ui/timer";

export default function Home() {
  const [scramble, setScramble] = useState<string>();

  return (
    <div className="flex flex-col w-full h-full">
      <Scramble />
      <Timer />
    </div>
  )
}