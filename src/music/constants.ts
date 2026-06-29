import type { Note, Intervals, Semitone } from "./types";

export const a4hz = 440.0;
export const naturals = ["A", "B", "C", "D", "E", "F", "G"] as const;
export const accidentals = {
  flat: "♭",
  natural: "♮",
  sharp: "♯",
} as const;
export const notes = [
  {
    sharp: "G𝄪",
    natural: "A",
    flat: "B𝄫",
  },
  {
    sharp: "A♯",
    flat: "B♭",
  },
  {
    sharp: "A𝄪",
    natural: "B",
    flat: "C♭",
  },
  {
    sharp: "B♯",
    natural: "C",
    flat: "D𝄫",
  },
  {
    sharp: "C♯",
    flat: "D♭",
  },
  {
    sharp: "C𝄪",
    natural: "D",
    flat: "E𝄫",
  },
  {
    sharp: "D♯",
    flat: "E♭",
  },
  {
    sharp: "D𝄪",
    natural: "E",
    flat: "F♭",
  },
  {
    sharp: "E♯",
    natural: "F",
    flat: "G𝄫",
  },
  {
    sharp: "F♯",
    flat: "G♭",
  },
  {
    sharp: "F𝄪",
    natural: "G",
    flat: "A𝄫",
  },
  {
    sharp: "G♯",
    flat: "A♭",
  },
] as const satisfies Semitone[];
export const semitonesInOctave = notes.length;
export const noteToIndex = notes.reduce(
  (map, value, index) => {
    for (const key in value) {
      map[value[key as keyof typeof value]] = index;
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
