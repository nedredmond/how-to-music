import {
  chordQualityIntervalMap,
  qualities,
  semitonesInOctave,
  eharmonicEquivalentToSemitoneIdx,
} from "./constants";
import type { Chord, Note, Scale, Quality } from "./types";
import { wrapIndex } from "./utils";

const chordQuality = (notesInChord: Note[]) => {
  const intervals = notesInChord.reduce<number[]>(
    (intervals, note, i, notes) => {
      if (i === 0) {
        return intervals;
      }
      const prevNoteIdx = eharmonicEquivalentToSemitoneIdx[notes[i - 1]];
      const currentNoteIdx = eharmonicEquivalentToSemitoneIdx[note];
      const diff = currentNoteIdx - prevNoteIdx;
      intervals.push(wrapIndex(diff, semitonesInOctave));
      return intervals;
    },
    [],
  );
  const matchingIdx = Object.values(chordQualityIntervalMap).findIndex(
    (intArr) => intArr.every((v, i) => v === intervals[i]),
  );
  if (matchingIdx === undefined) {
    throw new Error("Cannot determine chord quality from given intervals.");
  }
  return Object.keys(chordQualityIntervalMap)[matchingIdx] as Quality;
};

const transformRomanNumeralAnalysis = (
  quality: Quality,
): ((numeral: string) => string) => {
  switch (quality) {
    case "major":
      return (numeral) => numeral.toUpperCase();
    case "minor":
      return (numeral) => numeral;
    case "diminished":
      return (numeral) => `${numeral}${qualities[quality]}`;
    case "seventh":
    case "augmented":
      return (numeral) => `${numeral.toUpperCase()}${qualities[quality]}`;
    default:
      quality satisfies never;
      throw new Error("invalid quality");
  }
};

const romanNumerals = ["i", "ii", "iii", "iv", "v", "vi", "vii"] as const;

const getRomanNumeral = (idx: number, quality: Quality) =>
  transformRomanNumeralAnalysis(quality)(romanNumerals[idx]);

export const getChords = (scale: Readonly<Scale>) => {
  const heptatonicForm = scale.slice(0, -1);
  return heptatonicForm.reduce<Chord[]>((chords, note, i) => {
    const root = i;
    const third = i + 2;
    const fifth = i + 4;
    const notes = [
      scale[wrapIndex(root, heptatonicForm.length)],
      scale[wrapIndex(third, heptatonicForm.length)],
      scale[wrapIndex(fifth, heptatonicForm.length)],
    ];
    const quality = chordQuality(notes);
    chords.push({
      notes,
      idxs: [root, third, fifth],
      name: `${note}${qualities[quality]}`,
      romanNumeral: getRomanNumeral(i, quality),
    });
    return chords;
  }, []);
};
