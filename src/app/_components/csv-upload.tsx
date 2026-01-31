"use client"

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Upload, FileCheck, Eye } from "lucide-react";
import Link from "next/link";
import { saveUploadedFile } from "~/lib/csvStorage";

export default function CsvUpload() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (file: File | null) => {
    if (file && file.type === "text/csv") {
      setIsUploading(true);
      try {
        await saveUploadedFile(file);
        setSelectedFile(file);
      } catch (error) {
        console.error("Failed to save file:", error);
        alert("Failed to save file. Please try again.");
      } finally {
        setIsUploading(false);
      }
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

  const handleUploadAnother = () => {
    setSelectedFile(null);
    // Reset file input
    const fileInput = document.getElementById("file-input") as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  return (
    <div className="w-full space-y-6">
      {!selectedFile ? (
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
            disabled={isUploading}
          />
          <div className="flex flex-col items-center space-y-4">
            <div className="rounded-full bg-primary/10 p-4">
              <Upload className="h-8 w-8 text-primary" />
            </div>
            <div className="font-medium text-md text-center">
              {isUploading
                ? "Uploading..."
                : isDragging
                  ? "Drop your CSV file here"
                  : "Choose CSV file or drag here"}
            </div>
            <Button variant="outline" type="button" disabled={isUploading}>
              {isUploading ? "Processing..." : "Browse Files"}
            </Button>
            <p className="text-xs text-muted-foreground">
              Supports .csv files only
            </p>
          </div>
        </div>
      ) : (
        <div className="rounded-lg border-2 border-primary/20 bg-primary/5 p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              <div className="rounded-full bg-green-100 p-3">
                <FileCheck className="h-6 w-6 text-green-600" />
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold text-lg">File Uploaded Successfully</h3>
                <p className="text-sm text-muted-foreground">
                  <strong>Name:</strong> {selectedFile.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>Size:</strong> {(selectedFile.size / 1024).toFixed(2)} KB
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/preview">
              <Button className="gap-2">
                <Eye className="h-4 w-4" />
                View Preview
              </Button>
            </Link>
            <Button variant="outline" onClick={handleUploadAnother}>
              Upload Another File
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
