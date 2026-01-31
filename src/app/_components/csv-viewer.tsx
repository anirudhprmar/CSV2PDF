"use client";

import { useState, useRef, useEffect } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Button } from "~/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { X, Download, FileText, Search, Filter } from "lucide-react";
import { Input } from "~/components/ui/input";

interface CsvViewerProps {
  file: File;
  onClose: () => void;
}

export default function CsvViewer({ file, onClose }: CsvViewerProps) {
  const [csvData, setCsvData] = useState<string[][]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const parentRef = useRef<HTMLDivElement>(null);

  // Parse CSV file
  useEffect(() => {
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
  }, [file]);

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
            <p className="text-lg font-medium">Parsing CSV...</p>
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

  // Filter rows based on search term
  const filteredRows = searchTerm
    ? dataRows.filter((row) =>
        row.some((cell) =>
          cell.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    : dataRows;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-background rounded-lg shadow-2xl w-full max-w-7xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex flex-col border-b">
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">{file.name}</h2>
                <p className="text-sm text-muted-foreground">
                  {filteredRows.length.toLocaleString()} rows × {headers.length} columns
                  {searchTerm && ` (filtered from ${dataRows.length.toLocaleString()})`}
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

          {/* Search Bar */}
          <div className="px-6 pb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search in table..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>

        {/* Virtualized Table Container */}
        <VirtualizedTable
          headers={headers}
          rows={filteredRows}
          parentRef={parentRef}
        />

        {/* Footer */}
        <div className="border-t p-4 bg-muted/30">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <p>File size: {(file.size / 1024).toFixed(2)} KB</p>
            <p>
              Last modified: {new Date(file.lastModified).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Separate virtualized table component using shadcn Table components
function VirtualizedTable({
  headers,
  rows,
  parentRef,
}: {
  headers: string[];
  rows: string[][];
  parentRef: React.RefObject<HTMLDivElement | null>;
}) {
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 48, // Estimated row height in pixels
    overscan: 10, // Number of items to render outside visible area
  });

  return (
    <div ref={parentRef} className="flex-1 overflow-auto px-6">
      <Table>
        <TableHeader className="sticky top-0 z-10 bg-background">
          <TableRow>
            {headers.map((header, index) => (
              <TableHead
                key={index}
                className="font-semibold text-foreground min-w-37.5"
              >
                {header || `Column ${index + 1}`}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {/* Virtualized Rows Container */}
          <tr>
            <td colSpan={headers.length} className="p-0">
              <div
                style={{
                  height: `${rowVirtualizer.getTotalSize()}px`,
                  width: "100%",
                  position: "relative",
                }}
              >
                {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                  const row = rows[virtualRow.index];
                  return (
                    <div
                      key={virtualRow.index}
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: `${virtualRow.size}px`,
                        transform: `translateY(${virtualRow.start}px)`,
                      }}
                    >
                      <table className="w-full">
                        <tbody>
                          <TableRow>
                            {row?.map((cell, cellIndex) => (
                              <TableCell
                                key={cellIndex}
                                className="min-w-37.5 truncate"
                                title={cell} // Show full text on hover
                              >
                                {cell}
                              </TableCell>
                            ))}
                          </TableRow>
                        </tbody>
                      </table>
                    </div>
                  );
                })}
              </div>
            </td>
          </tr>

          {/* Empty State */}
          {rows.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={headers.length}
                className="h-24 text-center"
              >
                <div className="flex flex-col items-center justify-center space-y-2">
                  <Filter className="h-8 w-8 text-muted-foreground" />
                  <p className="text-muted-foreground">No data found</p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
