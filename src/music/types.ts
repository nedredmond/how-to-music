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
export type Tone = "A" | "B" | "C" | "D" | "E" | "F" | "G";
export type Semitone = {
  sharp: `${Exclude<Tone, "B" | "E">}♯`;
  flat: `${Exclude<Tone, "C" | "F">}♭`;
};
export type Note = Tone | Semitone["sharp"] | Semitone["flat"];
export type Scale = [Note, Note, Note, Note, Note, Note, Note, Note];
