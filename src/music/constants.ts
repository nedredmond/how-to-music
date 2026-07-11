import type { Note, Intervals as IntervalSet, Semitone } from "./types";

export const heptatonicScaleLength = 7;

export const naturals = ["A", "B", "C", "D", "E", "F", "G"] as const;
export const accidentals = {
  flat: "♭",
  natural: "♮",
  sharp: "♯",
} as const;
export const qualities = {
  major: "",
  minor: "m",
  seventh: "<sup>7</sup>",
  diminished: "°",
  augmented: "<sup>+</sup>",
} as const;

export const semitones = [
  ["D𝄫", "C", "B♯"],
  ["D♭", "C♯", "B𝄪"],
  ["E𝄫", "D", "C𝄪"],
  ["F𝄫", "E♭", "D♯"],
  ["F♭", "E", "D𝄪"],
  ["G𝄫", "F", "E♯"],
  ["G♭", "F♯", "E𝄪"],
  ["A𝄫", "G", "F𝄪"],
  ["A♭", "G♯"],
  ["B𝄫", "A", "G𝄪"],
  ["C𝄫", "B♭", "A♯"],
  ["C♭", "B", "A𝄪"],
] as const satisfies Semitone[];
export const semitonesInOctave = semitones.length; // 12
export const eharmonicEquivalentToSemitoneIdx = semitones.reduce(
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

export const chordQualityIntervalMap = {
  major: [4, 3],
  minor: [3, 4],
  seventh: [4, 3, 3],
  augmented: [4, 4],
  diminished: [3, 3],
} as const satisfies Record<keyof typeof qualities, number[]>;
export const romanNumerals = [
  "i",
  "ii",
  "iii",
  "iv",
  "v",
  "vi",
  "vii",
] as const;
