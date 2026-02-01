"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { FileCard } from "./FileCard";
import { EmptyState } from "./EmptyState";

interface File {
  id: string;
  fileName: string;
  fileSize: number;
  lastAccessedAt: Date;
  uploadedAt: Date;
  rowCount: number;
  columnCount: number;
  columns: string[];
  data: string[][];
}

interface FileListProps {
  files: File[];
  onDeleteFile: (id: string) => void;
}

export function FileList({ files, onDeleteFile }: FileListProps) {
  const [activeTab, setActiveTab] = useState("recent");

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
              onDelete={onDeleteFile}
            />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
