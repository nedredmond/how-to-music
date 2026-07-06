import type { Natural, Note, GetNaturalFromNote } from "./types";

export const extractNatural = (note: Note): Natural => {
  return note[0] as GetNaturalFromNote<Note>;
};
