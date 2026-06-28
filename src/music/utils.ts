import {
  a4hz,
  notes,
  noteToIndex,
  scaleIntervals,
  semitonesInOctave,
} from "./constants";
import type { Note, Scale, Semitone } from "./types";

export const getFreq = (semitones: number, relativeToFreq: number = a4hz) =>
  (relativeToFreq * 2) ^ (semitones / semitonesInOctave);

/**
 * Determine whether to add the sharp or flat variant of a semitone.
 *
 */
const determineSemitone = (semitone: Semitone, scale: Scale) => {
  const noteSet = new Set(scale.map((note) => note[0]));
  return noteSet.has(semitone.sharp[0]) ? semitone.flat : semitone.sharp;
};

export const getScale = (
  rootTonic: Note,
  intervals: keyof typeof scaleIntervals,
): Readonly<Scale> => {
  const scale: Scale = [
    rootTonic,
    rootTonic,
    rootTonic,
    rootTonic,
    rootTonic,
    rootTonic,
    rootTonic,
    rootTonic,
  ];
  let noteIdx = noteToIndex[rootTonic];
  for (const [i, interval] of scaleIntervals[intervals].entries()) {
    noteIdx += interval;
    const currentNote = notes[noteIdx % semitonesInOctave];
    scale[i + 1] =
      typeof currentNote === "string"
        ? currentNote
        : determineSemitone(currentNote, scale);
  }
  return scale;
};
