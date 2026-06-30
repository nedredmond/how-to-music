import type { Note, Intervals as IntervalSet, Semitone } from "./types";

export const a4hz = 440.0;
export const scaleLength = 8;

export const naturals = ["A", "B", "C", "D", "E", "F", "G"] as const;
export const accidentals = {
  flat: "♭",
  natural: "♮",
  sharp: "♯",
} as const;

export const semitones = [
  ["G𝄪", "A", "B𝄫"],
  ["A♯", "B♭", "C𝄫"],
  ["A𝄪", "B", "C♭"],
  ["B♯", "C", "D𝄫"],
  ["B𝄪", "C♯", "D♭"],
  ["C𝄪", "D", "E𝄫"],
  ["D♯", "E♭", "F𝄫"],
  ["D𝄪", "E", "F♭"],
  ["E♯", "F", "G𝄫"],
  ["E𝄪", "F♯", "G♭"],
  ["F𝄪", "G", "A𝄫"],
  ["G♯", "A♭"],
] as const satisfies Semitone[];
export const semitonesInOctave = semitones.length;
export const semitoneToIndex = semitones.reduce(
  (map, semitone, index) => {
    for (const note of semitone) {
      map[note as Note] = index;
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
  [key: string]: IntervalSet;
};

export const modeIntervals = {
  ionian: [2, 2, 1, 2, 2, 2, 1],
  dorian: [2, 1, 2, 2, 2, 1, 2],
  phrygian: [1, 2, 2, 2, 1, 2, 2],
  lydian: [2, 2, 2, 1, 2, 2, 1],
  mixolydian: [2, 2, 1, 2, 2, 1, 2],
  aeolian: [2, 1, 2, 2, 1, 2, 2],
  locrian: [1, 2, 2, 1, 2, 2, 2],
} as const satisfies {
  [key: string]: IntervalSet;
};

export const intervals = { ...scaleIntervals, ...modeIntervals };
