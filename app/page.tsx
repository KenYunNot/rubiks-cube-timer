"use client";

import { useState } from "react";
import Timer from "@/app/ui/timer";

export default function Home() {
  const [scramble, setScramble] = useState<string>();

  return (
    <div className="w-full h-full">
      <Timer />
    </div>
  )
}