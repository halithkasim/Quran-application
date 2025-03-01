import { bookmarks, type Bookmark, type InsertBookmark } from "@shared/schema";

export interface IStorage {
  getBookmarks(): Promise<Bookmark[]>;
  addBookmark(bookmark: InsertBookmark): Promise<Bookmark>;
  removeBookmark(id: number): Promise<void>;
}

export class MemStorage implements IStorage {
  private bookmarks: Map<number, Bookmark>;
  private currentId: number;

  constructor() {
    this.bookmarks = new Map();
    this.currentId = 1;
  }

  async getBookmarks(): Promise<Bookmark[]> {
    return Array.from(this.bookmarks.values());
  }

  async addBookmark(insertBookmark: InsertBookmark): Promise<Bookmark> {
    const id = this.currentId++;
    const bookmark: Bookmark = { ...insertBookmark, id };
    this.bookmarks.set(id, bookmark);
    return bookmark;
  }

  async removeBookmark(id: number): Promise<void> {
    this.bookmarks.delete(id);
  }
}

export const storage = new MemStorage();
