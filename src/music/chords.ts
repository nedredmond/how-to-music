import {
  chordQualityIntervalMap,
  qualities,
  semitonesInOctave,
  eharmonicEquivalentToSemitoneIdx,
} from "./constants";
import type { Chord, Note, Scale, Quality } from "./types";

const chordQuality = (notesInChord: Note[]) => {
  const intervals = notesInChord.reduce<number[]>(
    (intervals, note, i, notes) => {
      if (i === 0) {
        return intervals;
      }
      const prevNoteIdx = eharmonicEquivalentToSemitoneIdx[notes[i - 1]];
      const currentNoteIdx = eharmonicEquivalentToSemitoneIdx[note];
      const diff = currentNoteIdx - prevNoteIdx;
      intervals.push(
        ((diff % semitonesInOctave) + semitonesInOctave) % semitonesInOctave,
      );
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

const romanNumeral = (idx: number, quality: Quality) =>
  transformRomanNumeralAnalysis(quality)(romanNumerals[idx]);

export const getChords = (scale: Readonly<Scale>) => {
  const heptatonicForm = scale.slice(0, -1);
  const extendedScale = [...heptatonicForm, ...scale];
  console.log({ heptatonicForm });
  return heptatonicForm.reduce<Chord[]>((chords, note, i) => {
    const root = i;
    const third = i + 2;
    const fifth = i + 4;
    const notes = [
      extendedScale[root],
      extendedScale[third],
      extendedScale[fifth],
    ];
    const quality = chordQuality(notes);
    chords.push({
      idxs: [root, third, fifth],
      notes: [extendedScale[root], extendedScale[third], extendedScale[fifth]],
      name: `${note}${qualities[quality]}`,
      romanNumeral: romanNumeral(i, quality),
    });
    return chords;
  }, []);
};
