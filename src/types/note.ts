// src/types/note.ts

export type Note = {
  id: number;
  title: string;
  content: string;
  isPinned: boolean;
  color?: string;
  tags?: string[];
  createdAt: string;
};

export type CreateNotePayload = {
  title: string;
  content: string;
  isPinned?: boolean;
  color?: string;
  tags?: string[];
};
