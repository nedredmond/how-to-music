import type {
  naturals,
  scaleIntervals,
  modeIntervals,
  qualities,
  romanNumerals,
  accidentals,
} from "./constants";

/**
 * Starting from tonic / root, interval to next note in scale
 */
export type Intervals = readonly [
  number,
  number,
  number,
  number,
  number,
  number,
  number,
];
export type Natural = (typeof naturals)[number];
export type Sharp = `${Natural}♯`;
export type DoubleSharp = `${Natural}𝄪`;
export type Flat = `${Natural}♭`;
export type DoubleFlat = `${Natural}𝄫`;
export type Note = Natural | Sharp | DoubleSharp | Flat | DoubleFlat;
export type Semitone = [Note, Note, Note?];

export type Accidental = keyof typeof accidentals;
export type AccidentalDecoration = (typeof accidentals)[Accidental];
export type Quality = keyof typeof qualities;
export type QualityDecoration = (typeof qualities)[Quality];

export type LowercaseNumeral = (typeof romanNumerals)[number];
export type BaseNumeral = LowercaseNumeral | Uppercase<LowercaseNumeral>;
export type DecoratedNumeral = `${BaseNumeral}${string}`;
export interface Chord {
  name: `${Note}${QualityDecoration}`;
  notes: Note[];
  idxs: number[];
  romanNumeral: DecoratedNumeral;
}

export type GetNaturalFromNote<T extends Note> =
  T extends `${infer First}${infer _}` ? First : "";

export type Scale = [Note, Note, Note, Note, Note, Note, Note, Note];
export type ScaleName = keyof typeof scaleIntervals;
export type Mode = keyof typeof modeIntervals;
export type IntervalSetName = ScaleName | Mode;
