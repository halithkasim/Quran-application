import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertBookmarkSchema } from "@shared/schema";
import fetch from "node-fetch";

export async function registerRoutes(app: Express): Promise<Server> {
  // Quran API
  app.post("/api/chat/medical", async (req, res) => {
    try {
      const { message } = req.body;
      const diagnosis = await checkSymptoms([message]);
      res.json(diagnosis);
    } catch (error) {
      console.error('Error processing medical query:', error);
      res.status(500).json({ error: 'Failed to process medical query' });
    }
  });

  app.get("/api/quran", async (_req, res) => {
    try {
      const response = await fetch('http://api.alquran.cloud/v1/quran/ar.alafasy');
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error('Error fetching Quran data:', error);
      res.status(500).json({ error: 'Failed to fetch Quran data' });
    }
  });

  // Hadith API
  app.get("/api/hadith/:collection", async (req, res) => {
    try {
      const { collection } = req.params;
      const response = await fetch(`http://api.alquran.cloud/v1/hadith/${collection}`);
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error('Error fetching hadith data:', error);
      res.status(500).json({ error: 'Failed to fetch hadith data' });
    }
  });

  // Bookmarks API
  app.get("/api/bookmarks", async (_req, res) => {
    const bookmarks = await storage.getBookmarks();
    res.json(bookmarks);
  });

  app.post("/api/bookmarks", async (req, res) => {
    const result = insertBookmarkSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ error: "Invalid bookmark data" });
      return;
    }

    const bookmark = await storage.addBookmark(result.data);
    res.status(201).json(bookmark);
  });

  app.delete("/api/bookmarks/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid bookmark ID" });
      return;
    }

    await storage.removeBookmark(id);
    res.status(204).send();
  });

  const httpServer = createServer(app);
  return httpServer;
}