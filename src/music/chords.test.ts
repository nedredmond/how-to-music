import { expect, test } from "vitest";
import type { Chord, Note, ScaleName } from "./types";
import { getScale } from "./scales";
import { getChords } from "./chords";

test.each([
  [
    "C",
    "major",
    [
      {
        idxs: [0, 2, 4],
        notes: ["C", "E", "G"],
        name: "C",
        romanNumeral: "I",
      },
      {
        idxs: [1, 3, 5],
        notes: ["D", "F", "A"],
        name: "Dm",
        romanNumeral: "ii",
      },
      {
        idxs: [2, 4, 6],
        notes: ["E", "G", "B"],
        name: "Em",
        romanNumeral: "iii",
      },
      {
        idxs: [3, 5, 7],
        notes: ["F", "A", "C"],
        name: "F",
        romanNumeral: "IV",
      },
      {
        idxs: [4, 6, 8],
        notes: ["G", "B", "D"],
        name: "G",
        romanNumeral: "V",
      },
      {
        idxs: [5, 7, 9],
        notes: ["A", "C", "E"],
        name: "Am",
        romanNumeral: "vi",
      },
      {
        idxs: [6, 8, 10],
        notes: ["B", "D", "F"],
        name: "B°",
        romanNumeral: "vii°",
      },
    ],
  ],
] satisfies [Note, ScaleName, Partial<Chord>[]][])(
  "getChords returns correct chords for key of $0 $1",
  (root, scale, want) => {
    expect(getChords(getScale(root, scale))).toEqual(
      expect.arrayContaining(want),
    );
  },
);
