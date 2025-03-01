import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const bookmarks = pgTable("bookmarks", {
  id: serial("id").primaryKey(),
  surahNumber: integer("surah_number").notNull(),
  ayahNumber: integer("ayah_number").notNull(),
  note: text("note"),
});

export const insertBookmarkSchema = createInsertSchema(bookmarks).pick({
  surahNumber: true,
  ayahNumber: true,
  note: true,
});

export type InsertBookmark = z.infer<typeof insertBookmarkSchema>;
export type Bookmark = typeof bookmarks.$inferSelect;

// Types for Quran data
export interface Verse {
  number: number;
  text: string;
  translation: string;
  audioUrl?: string;
  // Search context fields
  surahNumber?: number;
  surahName?: string;
  surahEnglishName?: string;
}

export interface Chapter {
  number: number;
  name: string;
  englishName: string;
  versesCount: number;
  verses: Verse[];
}

// New types for Hadith data
export interface Hadith {
  collection: string;
  bookNumber: number;
  hadithNumber: number;
  englishNarrator: string;
  arabicNarrator: string;
  englishText: string;
  arabicText: string;
  grade?: string;
  reference: string;
}

export interface HadithCollection {
  name: string;
  englishName: string;
  numberOfBooks: number;
  numberOfHadith: number;
  hadiths: Hadith[];
}