"use client";

import { useState, useRef, useEffect } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Download, FileText, Search, Filter, Save, ArrowLeft, MoreVertical, Trash2 } from "lucide-react";
import { Input } from "~/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import Papa from "papaparse";
import { fileStorage } from "~/lib/db";
import { clearUploadedFile } from "~/lib/csvStorage";
import { toast } from "sonner";
import LoginDialog from "./login-dialog";

interface CsvViewerProps {
  file: File;
  onClose: () => void;
}

export default function CsvViewer({ 
  file, 
  onClose,
}: CsvViewerProps) {
  const router = useRouter();
  const [csvData, setCsvData] = useState<string[][]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  const parentRef = useRef<HTMLDivElement>(null);

  // Parse CSV file using PapaParse
  useEffect(() => {
    Papa.parse(file, {
      complete: (results) => {
        try {
          // Filter out empty rows
          const filteredData = results.data.filter((row: unknown) => {
            if (Array.isArray(row)) {
              return row.some((cell) => cell !== "" && cell !== null && cell !== undefined);
            }
            return false;
          }) as string[][];

          setCsvData(filteredData);
          setIsLoading(false);
        } catch (err) {
          setError("Failed to parse CSV file");
          setIsLoading(false);
        }
      },
      error: (err) => {
        console.error("PapaParse error:", err);
        setError("Failed to read CSV file");
        setIsLoading(false);
      },
      skipEmptyLines: true,
      dynamicTyping: false, // Keep all values as strings
    });
  }, [file]);

  const handleSaveToDatabase = async () => {
    if (!isAuthenticated) {
      setShowLoginDialog(true);
      return;
    }

    if (!hasPurchased) {
      toast.error("Please upgrade to Premium to save files");
      router.push("/pricing"); 
      return;
    }

    setIsSaving(true);

    // Use setTimeout to allow the UI to update (show loading spinner) before
    // the heavy serialization task starts on the main thread.
    setTimeout(async () => {
      try {
        const headers = csvData[0] || [];
        const dataRows = csvData.slice(1);

        await fileStorage.addFile({
          fileName: file.name,
          fileSize: file.size,
          rowCount: dataRows.length,
          columnCount: headers.length,
          columns: headers,
          data: dataRows,
        });

        toast.success("File saved to dashboard!");

        // Navigate to dashboard after saving
        setTimeout(() => {
          router.push("/dashboard");
        }, 1000);
      } catch (error) {
        console.error("Failed to save file:", error);
        toast.error("Failed to save file. Please try again.");
        setIsSaving(false);
      }
    }, 50);
  };

  const downloadAsPdf = async () => {
    if (!isAuthenticated) {
      setShowLoginDialog(true);
      return;
    }

    if (!hasPurchased) {
      toast.error("Please upgrade to Premium to download PDF");
      router.push("/pricing");
      return;
    }

    // 4MB limit check
    const MAX_SIZE = 4 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
        toast.error("File is too large for PDF generation (Max 4MB)");
        return;
    }

    setIsDownloading(true);
    setProgress(20); 

    try {
        const headers = csvData[0] || [];
        const dataRows = csvData.slice(1);

        const worker = new Worker(new URL("../../workers/pdf.worker.ts", import.meta.url));

        worker.onmessage = (e: MessageEvent) => {
            const { status, data, message } = e.data;
            if (status === "success") {
                const blob = new Blob([data], { type: "application/pdf" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = file.name.replace(".csv", ".pdf");
                a.click();
                URL.revokeObjectURL(url);
                toast.success("PDF downloaded successfully!");
                setProgress(100);
            } else {
                console.error("Worker error:", message);
                toast.error("Failed to generate PDF: " + message);
            }
            setIsDownloading(false);
            setProgress(0);
            worker.terminate();
        };

        worker.onerror = (err) => {
            console.error("Worker error:", err);
            toast.error("An error occurred in PDF generation worker");
            setIsDownloading(false);
            setProgress(0);
            worker.terminate();
        };

        worker.postMessage({
            headers,
            rows: dataRows,
            fileName: file.name.replace(".csv", "")
        });

    } catch (error) {
      console.error("PDF generation setup failed:", error);
      toast.error("Failed to start PDF generation");
      setIsDownloading(false);
      setProgress(0);
    }
  };

  const handleBack = () => {
    // If authenticated, go to dashboard; otherwise go to landing page
    if (isAuthenticated) {
      router.push("/dashboard");
    } else {
      onClose();
    }
  };

  const handleClear = async () => {
    try {
      await clearUploadedFile();
      toast.success("File cleared");
      
      if (isAuthenticated) {
        router.push("/dashboard");
      } else {
        onClose();
      }
    } catch (error) {
      console.error("Failed to clear file:", error);
      toast.error("Failed to clear file");
    }
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
    <div className="w-full h-screen flex items-center justify-center p-4">
      <div className="bg-background rounded-lg shadow-2xl w-full max-w-7xl h-[calc(100vh-2rem)] flex flex-col">
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
              {/* Desktop Actions */}
              <div className="hidden md:flex items-center gap-2">
                  <div className="flex items-center justify-center gap-2">
                    <Button 
                      onClick={handleSaveToDatabase} 
                      variant="outline" 
                      size="sm"
                      disabled={isSaving}
                    >
                      <Save className="mr-2 h-4 w-4" />
                      {isSaving ? "Saving..." : "Save to Dashboard"}
                    </Button>
                    
                    <Button 
                      onClick={downloadAsPdf} 
                      variant="default" 
                      size="sm"
                      disabled={isDownloading}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      {isDownloading ? `Generating... ${progress}%` : "Download PDF"}
                    </Button>
                          
                  </div>
                  <Button onClick={handleClear} variant="outline" size="sm" className="text-destructive hover:text-destructive">
                    Clear File
                  </Button>
                  <Button onClick={handleBack} variant="ghost" size="sm">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    {isAuthenticated ? "Back to Dashboard" : "Back to Upload"}
                  </Button>
              </div>

              {/* Mobile Actions Dropdown */}
              <div className="md:hidden">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                      <>
                        <DropdownMenuItem onClick={handleSaveToDatabase} disabled={isSaving}>
                           <Save className="mr-2 h-4 w-4" />
                           Save
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={downloadAsPdf} disabled={isDownloading}>
                           <Download className="mr-2 h-4 w-4" />
                           Download PDF
                        </DropdownMenuItem>
                      </>
                    <DropdownMenuItem onClick={handleClear} className="text-destructive">
                       <Trash2 className="mr-2 h-4 w-4" />
                       Clear File
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleBack}>
                       <ArrowLeft className="mr-2 h-4 w-4" />
                       Back
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
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

      {/* Login Dialog for unauthenticated users */}
      <LoginDialog 
        open={showLoginDialog} 
        onClose={() => setShowLoginDialog(false)} 
      />
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
