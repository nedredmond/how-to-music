import type {
  naturals,
  scaleIntervals,
  modeIntervals,
  qualities,
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

export type Quality = keyof typeof qualities;
type QualityDecoration = (typeof qualities)[Quality];
export interface Chord {
  name: `${Note}${QualityDecoration}`;
  notes: Note[];
  idxs: number[];
  romanNumeral: string;
}

export type GetNaturalFromNote<T extends Note> =
  T extends `${infer First}${infer _}` ? First : "";

export type Scale = [Note, Note, Note, Note, Note, Note, Note, Note];
export type ScaleName = keyof typeof scaleIntervals;
export type Mode = keyof typeof modeIntervals;
export type IntervalSetName = ScaleName | Mode;
