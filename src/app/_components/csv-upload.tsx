"use client"

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Upload } from "lucide-react";
import CsvViewer from "./csv-viewer";

export default function CsvUpload() {
   const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (file: File | null) => {
    if (file && file.type === "text/csv") {
      setSelectedFile(file);
    } else if (file) {
      alert("Please upload a valid CSV file");
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    handleFileChange(file || null);
  };

  return (
    <>   
     <div
      className={`w-full cursor-pointer rounded-lg border-2 border-dashed p-8 transition-all ${
        isDragging
          ? "border-primary bg-primary/5 scale-105"
          : "hover:border-primary/50 hover:bg-muted/30"
      }`}
      onClick={() => document.getElementById("file-input")?.click()}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        id="file-input"
        type="file"
        accept=".csv"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          handleFileChange(file || null);
        }}
      />
      <div className="flex flex-col items-center space-y-4">
        <div className="rounded-full bg-primary/10 p-4">
          <Upload className="h-8 w-8 text-primary" />
        </div>
        <div className="font-medium text-md text-center">
          {isDragging
            ? "Drop your CSV file here"
            : "Choose CSV file or drag here"}
        </div>
        <Button variant="outline" type="button">
          Browse Files
        </Button>
        <p className="text-xs text-muted-foreground">
          Supports .csv files only
        </p>
      </div>
    </div>
     {selectedFile && (
        <CsvViewer
          file={selectedFile}
          onClose={() => setSelectedFile(null)}
        />
      )}
    </>
  )
}
