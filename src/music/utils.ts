import { a4hz, semitonesInOctave } from "./constants";
import type { Natural, Note, GetNaturalFromNote } from "./types";

export const getFreq = (semitones: number, relativeToFreq: number = a4hz) =>
  (relativeToFreq * 2) ^ (semitones / semitonesInOctave);

export const extractNatural = (note: Note): Natural => {
  return note[0] as GetNaturalFromNote<Note>;
};

export const wrapIndex = (n: number, size: number) =>
  ((n % size) + size) % size;
