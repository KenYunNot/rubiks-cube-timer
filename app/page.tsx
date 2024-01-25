"use client";

import { useState, useEffect, useRef } from "react";
import { Status, Settings } from "@/app/lib/definitions";
import Timer from "@/app/ui/timer";
import { StatusContext, SettingsContext  } from "@/app/contexts";

export default function Home() {
  const [status, setStatus] = useState<Status>("idle");
  const [settings, setSettings] = useState<Settings>({
    readyTime: 300,
    scrambleSize: 15,
    useInspection: true,
  });

  const interval = useRef<NodeJS.Timeout>();
  const intervalFn = () => {
    setStatus("ready");
    clearInterval(interval.current);
  }

  function handleKeyDown(e: any) {
    // Ignore events that are not space and those that repeat
    if (e.key !== ' ' || e.repeat) return;
    if (!settings.useInspection) {
      switch (status) {
        case "idle":
          setStatus("waiting");
          interval.current = setInterval(intervalFn, settings.readyTime);
          break;
        case "solving":
          setStatus("finished");
          break;
      }
    } else {
      switch (status) {
        case "idle":
          setStatus("starting");
          break;
        case "inspection":
          setStatus("waiting");
          interval.current = setInterval(intervalFn, settings.readyTime);
          break;
        case "solving":
          setStatus("finished");
          break;
      }
    }
    console.log(status);
  }

  function handleKeyUp(e: any) {
    // Ignore events that are not space and those that repeat
    if (e.key !== ' ' || e.repeat) return;
    if (!settings.useInspection) {
      switch (status) {
        case "waiting":
          setStatus("idle");
          clearInterval(interval.current);
          break;
        case "ready":
          setStatus("solving");
          break;
        case "finished":
          setStatus("idle");
          break;
      }
    } else {
      switch (status) {
        case "starting":
          setStatus("inspection");
          break;
        case "waiting":
          setStatus("inspection");
          clearInterval(interval.current);
          break;
        case "ready":
          setStatus("solving");
          break;
        case "finished":
          setStatus("idle");
          break;
      }
    }
    console.log(status);
  }

  useEffect(() => {
    addEventListener("keydown", handleKeyDown);
    addEventListener("keyup", handleKeyUp);

    return () => {
      removeEventListener("keydown", handleKeyDown);
      removeEventListener("keyup", handleKeyUp)
    }
  }, [status])

  return (
    <div className="w-full h-full">
      <StatusContext.Provider value={status}>
        <SettingsContext.Provider value={settings}>
          <Timer />
        </SettingsContext.Provider>
      </StatusContext.Provider>
    </div>
  )
}