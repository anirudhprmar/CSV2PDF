"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { X, Download, FileText } from "lucide-react";

interface CsvViewerProps {
  file: File;
  onClose: () => void;
}

export default function CsvViewer({ file, onClose }: CsvViewerProps) {
  const [csvData, setCsvData] = useState<string[][]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Parse CSV file
  useState(() => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const rows = text.split("\n").map((row) => {
          // Simple CSV parsing (handles basic cases)
          const cells: string[] = [];
          let currentCell = "";
          let insideQuotes = false;

          for (let i = 0; i < row.length; i++) {
            const char = row[i];

            if (char === '"') {
              insideQuotes = !insideQuotes;
            } else if (char === "," && !insideQuotes) {
              cells.push(currentCell.trim());
              currentCell = "";
            } else {
              currentCell += char;
            }
          }
          cells.push(currentCell.trim());
          return cells;
        });

        setCsvData(rows.filter((row) => row.some((cell) => cell !== "")));
        setIsLoading(false);
      } catch (err) {
        setError("Failed to parse CSV file");
        setIsLoading(false);
      }
    };

    reader.onerror = () => {
      setError("Failed to read file");
      setIsLoading(false);
    };

    reader.readAsText(file);
  });

  const downloadAsPdf = () => {
    // Placeholder for PDF download functionality
    console.log("Download as PDF clicked");
    // TODO: Implement PDF conversion
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="bg-background rounded-lg p-8 shadow-xl">
          <div className="flex items-center space-x-3">
            <div className="h-6 w-6 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="text-lg font-medium">Loading CSV...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="bg-background rounded-lg p-8 shadow-xl max-w-md">
          <div className="flex flex-col items-center space-y-4">
            <div className="text-destructive text-5xl">⚠️</div>
            <h3 className="text-xl font-semibold">Error</h3>
            <p className="text-muted-foreground text-center">{error}</p>
            <Button onClick={onClose} variant="outline">
              Close
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const headers = csvData[0] || [];
  const dataRows = csvData.slice(1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-background rounded-lg shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b p-4">
          <div className="flex items-center space-x-3">
            <FileText className="h-6 w-6 text-primary" />
            <div>
              <h2 className="text-xl font-semibold">{file.name}</h2>
              <p className="text-sm text-muted-foreground">
                {dataRows.length} rows × {headers.length} columns
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button onClick={downloadAsPdf} variant="default" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
            <Button onClick={onClose} variant="ghost" size="icon">
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Table Container */}
        <div className="flex-1 overflow-auto p-4">
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full border-collapse">
              <thead className="bg-muted sticky top-0">
                <tr>
                  {headers.map((header, index) => (
                    <th
                      key={index}
                      className="border-b border-r px-4 py-3 text-left text-sm font-semibold last:border-r-0"
                    >
                      {header || `Column ${index + 1}`}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {dataRows.map((row, rowIndex) => (
                  <tr
                    key={rowIndex}
                    className="hover:bg-muted/50 transition-colors"
                  >
                    {row.map((cell, cellIndex) => (
                      <td
                        key={cellIndex}
                        className="border-b border-r px-4 py-3 text-sm last:border-r-0"
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t p-4 bg-muted/30">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <p>
              File size: {(file.size / 1024).toFixed(2)} KB
            </p>
            <p>
              Last modified: {new Date(file.lastModified).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
