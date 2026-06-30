import {
  a4hz,
  naturals,
  semitones,
  semitoneToIndex,
  semitonesInOctave,
  scaleLength,
  intervals as intervalSets,
} from "./constants";
import type {
  Natural,
  Note,
  Scale,
  Semitone,
  GetNaturalFromNote,
  IntervalSetName,
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
  const nextNote = semitone.find((note) => note?.includes(nextNatural));
  if (!nextNote) throw new Error("Cannot construct scale!");
  return nextNote;
};

export const getScale = (
  tonic: Note,
  intervalSetName: IntervalSetName,
): Readonly<Scale> => {
  const scale = new Array<Note>(scaleLength);
  scale[0] = tonic;
  let noteIdx = semitoneToIndex[tonic];
  for (const [idx, interval] of intervalSets[intervalSetName].entries()) {
    noteIdx += interval;
    const currentSemitone = semitones[noteIdx % semitonesInOctave];
    scale[idx + 1] = determineNextNotation(currentSemitone, scale[idx]);
  }

  if (!isScale(scale)) {
    throw new Error("Cannot construct scale!");
  }
  return scale;
};
