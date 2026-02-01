"use client";

import { useEffect, useState } from "react";
import { FileList } from "./_components/FileList";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { fileStorage, type CSVFile } from "~/lib/db";

export default function Dashboard() {
  const [files, setFiles] = useState<CSVFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load files from Dexie on mount
  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    try {
      setIsLoading(true);
      const recentFiles = await fileStorage.getRecentFiles(20);
      setFiles(recentFiles);
    } catch (error) {
      console.error("Failed to load files:", error);
      toast.error("Failed to load files");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteFile = async (fileId: string) => {
    if (confirm("Are you sure you want to delete this file?")) {
      try {
        await fileStorage.deleteFile(fileId);
        toast.success("File deleted successfully");
        await loadFiles(); // Reload files
      } catch (error) {
        console.error("Failed to delete file:", error);
        toast.error("Failed to delete file");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-12rem)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-4 max-w-7xl">

      <FileList files={files} onDeleteFile={handleDeleteFile} />
    </div>
  );
}
