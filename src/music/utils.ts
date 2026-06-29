import {
  a4hz,
  naturals,
  notes,
  noteToIndex,
  scaleIntervals,
  semitonesInOctave,
} from "./constants";
import type {
  Natural,
  Note,
  Scale,
  Semitone,
  GetNaturalFromNote,
} from "./types";

export const getFreq = (semitones: number, relativeToFreq: number = a4hz) =>
  (relativeToFreq * 2) ^ (semitones / semitonesInOctave);

const extractNatural = (note: Note): Natural => {
  return note[0] as GetNaturalFromNote<Note>;
};

const isScale = (scale: Array<Note>): scale is Scale =>
  scale.length === 8 && scale[0] === scale[7];

/**
 * Determine whether to add the natural, sharp, or flat variant of a semitone.
 */
const determineNextNotation = (semitone: Semitone, prevNote: Note) => {
  const prevNaturalIdx = naturals.indexOf(extractNatural(prevNote));
  const nextNatural = naturals[(prevNaturalIdx + 1) % naturals.length];
  const nextNote = Object.values(semitone).find((note) =>
    note.includes(nextNatural),
  );
  if (!nextNote) throw new Error("Cannot construct scale!");
  return nextNote;
};

export const getScale = (
  tonic: Note,
  intervals: keyof typeof scaleIntervals,
): Readonly<Scale> => {
  const scale = new Array<Note>(8);
  scale[0] = tonic;
  let noteIdx = noteToIndex[tonic];
  for (const [i, interval] of scaleIntervals[intervals].entries()) {
    noteIdx += interval;
    const currentNote = notes[noteIdx % semitonesInOctave];
    scale[i + 1] = determineNextNotation(currentNote, scale[i]);
  }
  if (!isScale(scale)) {
    throw new Error("Cannot construct scale!");
  }
  return scale;
};
