"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { FileCard } from "./FileCard";
import { EmptyState } from "./EmptyState";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { fileStorage, type CSVFile } from "~/lib/db";


export function FileList() {
  const [activeTab, setActiveTab] = useState("recent");
  const [files, setFiles] = useState<CSVFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  
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
    try {
      await fileStorage.deleteFile(fileId);
      toast.success("File deleted successfully");
      await loadFiles(); // Reload files
    } catch (error) {
      console.error("Failed to delete file:", error);
      toast.error("Failed to delete file");
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-12rem)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (files.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
          <TabsTrigger value="recent">Recent</TabsTrigger>
        </TabsList>

        <TabsContent value="recent" className="mt-6 space-y-3">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Name</h3>
            </div>
          </div>
          
          {files.map((file) => (
            <FileCard
              key={file.id}
              id={file.id}
              fileName={file.fileName}
              fileSize={file.fileSize}
              lastAccessedAt={file.lastAccessedAt}
              onDelete={handleDeleteFile}
            />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
