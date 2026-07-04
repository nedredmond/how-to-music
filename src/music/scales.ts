import {
  naturals,
  semitones,
  eharmonicEquivalentToSemitoneIdx,
  semitonesInOctave,
  heptatonicScaleLength,
  intervals as intervalSets,
} from "./constants";
import type { Note, Semitone, IntervalSetName, Scale } from "./types";
import { extractNatural } from "./utils";

const isScale = (scale: Array<Note>): scale is Scale =>
  scale.length === heptatonicScaleLength + 1 && scale[0] === scale[7];

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
  key: Note,
  intervalSetName: IntervalSetName,
): Readonly<Scale> => {
  const scale = new Array<Note>(heptatonicScaleLength);
  scale[0] = key;
  let noteIdx = eharmonicEquivalentToSemitoneIdx[key];
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
