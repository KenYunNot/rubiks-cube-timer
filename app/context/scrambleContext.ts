import { createContext } from "react";

export const ScramblesContext = createContext({} as {scrambles: string[], setScrambles: any});
export const ScramblePointerContext = createContext({} as {scramblePointer: number, setScramblePointer: any});