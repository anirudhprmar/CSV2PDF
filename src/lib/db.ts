import Dexie, { type EntityTable } from "dexie";

// Define the CSV file interface
export interface CSVFile {
  id: string;
  fileName: string;
  fileSize: number;
  uploadedAt: Date;
  lastAccessedAt: Date;
  rowCount: number;
  columnCount: number;
  columns: string[];
  data: string[][]; // CSV data as 2D array
}

// Create the Dexie database
const db = new Dexie("CSV2PDFDatabase") as Dexie & {
  csvFiles: EntityTable<CSVFile, "id">;
};

// Define the schema
db.version(1).stores({
  csvFiles: "id, fileName, uploadedAt, lastAccessedAt",
});

export { db };

// Helper functions for file operations
export const fileStorage = {
  // Add a new CSV file
  async addFile(file: Omit<CSVFile, "id" | "uploadedAt" | "lastAccessedAt">) {
    const now = new Date();
    const newFile: CSVFile = {
      ...file,
      id: crypto.randomUUID(),
      uploadedAt: now,
      lastAccessedAt: now,
    };
    await db.csvFiles.add(newFile);
    return newFile;
  },

  // Get all files sorted by last accessed
  async getRecentFiles(limit = 20) {
    return await db.csvFiles
      .orderBy("lastAccessedAt")
      .reverse()
      .limit(limit)
      .toArray();
  },

  // Get all files sorted by upload date
  async getAllFiles() {
    return await db.csvFiles.orderBy("uploadedAt").reverse().toArray();
  },

  // Get a specific file by ID
  async getFileById(id: string) {
    return await db.csvFiles.get(id);
  },

  // Update last accessed timestamp
  async updateLastAccessed(id: string) {
    await db.csvFiles.update(id, { lastAccessedAt: new Date() });
  },

  // Delete a file
  async deleteFile(id: string) {
    await db.csvFiles.delete(id);
  },

  // Get total file count
  async getFileCount() {
    return await db.csvFiles.count();
  },

  // Clear all files (for testing or reset)
  async clearAll() {
    await db.csvFiles.clear();
  },
};
