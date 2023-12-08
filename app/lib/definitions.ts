export interface Solve {
  timer: string | number[],
  scramble: string,
  DNF: boolean,
  plusTwo: boolean
}


const BLACK = "text-black";
const RED = "text-red-500";
const YELLOW = "text-yellow-400";
const GREEN = "text-green-500";
export {
  BLACK,
  RED,
  YELLOW,
  GREEN
}


const IDLE = "IDLE"
const STARTING = "STARTING"
const INSPECTION = "INSPECTION"
const WAITING = "WAITING"
const READY = "READY";
const SOLVING = "SOLVING"
const FINISHED = "FINISHED"
const INTERRUPTED = "INTERRUPTED";
export {
  IDLE,
  STARTING,
  INSPECTION,
  WAITING,
  READY,
  SOLVING,
  FINISHED,
  INTERRUPTED,
}


const PREV = 0;
const CURR = 1;
export {
  PREV,
  CURR,
}