import type { naturals } from "./constants";

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
export type Semitone = {
  sharp: Sharp | DoubleSharp;
  natural?: Natural;
  flat: Flat | DoubleFlat;
};
export type Note = Natural | Sharp | DoubleSharp | Flat | DoubleFlat;
export type Scale = [Note, Note, Note, Note, Note, Note, Note, Note];

export type GetNaturalFromNote<T extends Note> =
  T extends `${infer First}${infer _}` ? First : "";
