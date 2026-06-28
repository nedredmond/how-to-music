import type { Note, Intervals, Semitone, Tone } from "./types";

export const a4hz = 440.0;
export const notes = [
  "A",
  {
    sharp: "A♯",
    flat: "B♭",
  },
  "B",
  "C",
  {
    sharp: "C♯",
    flat: "D♭",
  },
  "D",
  {
    sharp: "D♯",
    flat: "E♭",
  },
  "E",
  "F",
  {
    sharp: "F♯",
    flat: "G♭",
  },
  "G",
  {
    sharp: "G♯",
    flat: "A♭",
  },
] as const satisfies (Tone | Semitone)[];
export const semitonesInOctave = notes.length;
export const noteToIndex = notes.reduce(
  (map, value, index) => {
    if (typeof value === "string") map[value] = index;
    else {
      map[value.flat] = index;
      map[value.sharp] = index;
    }
    return map;
  },
  {} as Record<Note, number>,
);
export const scaleIntervals = {
  major: [2, 2, 1, 2, 2, 2, 1],
  naturalMinor: [2, 1, 2, 2, 1, 2, 2],
  harmonicMinor: [2, 1, 2, 2, 1, 3, 1],
  melodicMinor: [2, 1, 2, 2, 2, 2, 1],
} as const satisfies {
  [key: string]: Intervals;
};
