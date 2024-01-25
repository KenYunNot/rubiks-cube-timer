export type Status =
  | "idle"
  | "starting"
  | "inspection"
  | "waiting"
  | "ready"
  | "solving"
  | "finished";

export type Settings = {
  readyTime: number,
  scrambleSize: number,
  useInspection: boolean,
}