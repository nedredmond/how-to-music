import { expect, test } from "vitest";
import { getScale } from "./utils";
import type { scaleIntervals } from "./constants";
import type { Note, Scale } from "./types";

type ScaleName = keyof typeof scaleIntervals;

test.each([
  ["C", "major", ["C", "D", "E", "F", "G", "A", "B", "C"]],
  ["C", "naturalMinor", ["C", "D", "E♭", "F", "G", "A♭", "B♭", "C"]],
  ["C", "harmonicMinor", ["C", "D", "E♭", "F", "G", "A♭", "B", "C"]],
  ["C", "melodicMinor", ["C", "D", "E♭", "F", "G", "A", "B", "C"]],
  ["C♯", "major", ["C♯", "D♯", "E♯", "F♯", "G♯", "A♯", "B♯", "C♯"]],
  ["C♯", "naturalMinor", ["C♯", "D♯", "E", "F♯", "G♯", "A", "B", "C♯"]],
  ["C♯", "harmonicMinor", ["C♯", "D♯", "E", "F♯", "G♯", "A", "B♯", "C♯"]],
  ["C♯", "melodicMinor", ["C♯", "D♯", "E", "F♯", "G♯", "A♯", "B♯", "C♯"]],
  ["A", "major", ["A", "B", "C♯", "D", "E", "F♯", "G♯", "A"]],
] satisfies [Note, ScaleName, Scale][])(
  "getScale returns correct $0 $1 scale",
  (root, scale, want) => {
    expect(getScale(root, scale)).toEqual(want);
  },
);

test.each([
  ["C", "A"],
  ["C♯", "A♯"],
  ["D♭", "B♭"],
  ["D", "B"],
  ["E♭", "C"],
  ["E", "C♯"],
  ["F", "D"],
  ["F♯", "D♯"],
  ["G♭", "E♭"],
  ["G", "E"],
  ["A♭", "F"],
  ["A", "F♯"],
  ["B♭", "G"],
  ["B", "G♯"],
  ["C♭", "A♭"],
] satisfies [Note, Note][])(
  "Relative scales match: $0 major and $1 minor",
  (maj, min) => {
    expect(new Set(getScale(maj, "major"))).toEqual(
      new Set(getScale(min, "naturalMinor")),
    );
  },
);
