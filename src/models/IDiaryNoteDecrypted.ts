import { IDiaryNote } from "./IDiaryNote";

export interface IDiaryNoteDecrypted extends IDiaryNote {
  title: string;
  text: string;
}