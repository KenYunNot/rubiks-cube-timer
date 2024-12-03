import { Dispatch, SetStateAction } from "react";
import { createContext } from "react";
import { Settings, Status } from "@/app/lib/definitions";

export const SettingsContext = createContext({} as Settings);
export const StatusContext = createContext({} as Status);
export const DisplayContext = createContext([] as string[]);