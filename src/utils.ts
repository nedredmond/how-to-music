import {
  eharmonicEquivalentToSemitoneIdx,
  semitonesInOctave,
  type Note,
} from "./music";
import { getFreq } from "./synth";

export const wrapIndex = (n: number, size: number) =>
  ((n % size) + size) % size;

// Assumes notes are in rising pitch order and within a single octave
export const notesToFreqs = (notes: Readonly<Note[]>, start: Note = "A") => {
  const startIdx = eharmonicEquivalentToSemitoneIdx[start];
  let prevSemitoneIdx = 0;
  return notes.map((note) => {
    let semitoneIdx = eharmonicEquivalentToSemitoneIdx[note];
    // raise an octave
    if (semitoneIdx < prevSemitoneIdx || semitoneIdx < startIdx)
      semitoneIdx += semitonesInOctave;
    prevSemitoneIdx = semitoneIdx;
    return getFreq(semitoneIdx);
  });
};
