import { semitonesInOctave } from "../music";
import { a4hz } from "./constants";

export const getFreq = (semitone: number, relativeToFreq: number = a4hz) =>
  relativeToFreq * 2 ** (semitone / semitonesInOctave);
