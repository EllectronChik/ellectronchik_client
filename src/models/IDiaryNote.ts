export interface IDiaryNote {
  _id: string;
  encryptedTitle: string;
  encryptedText: string;
  diaryNoteMedia: { mediaPath: string; mediaIVHex: string }[];
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  iv: string;
  userId: string;
}