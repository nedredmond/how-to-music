import { eharmonicEquivalentToSemitoneIdx, semitonesInOctave } from "../music";
import { a4hz } from "./constants";

export const getFreq = (semitoneIdx: number, a4Idx?: number) => {
  a4Idx ??= eharmonicEquivalentToSemitoneIdx["A"];
  return a4hz * 2 ** ((semitoneIdx - a4Idx) / semitonesInOctave);
}
