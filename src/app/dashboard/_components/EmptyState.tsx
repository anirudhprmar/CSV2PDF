"use client";

import { FileText, Upload } from "lucide-react";
import { Button } from "~/components/ui/button";
import Link from "next/link";

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
        <FileText className="h-10 w-10 text-muted-foreground" />
      </div>
      
      <h3 className="mt-6 text-xl font-semibold text-foreground">No documents yet</h3>
      <p className="mt-2 text-center text-muted-foreground max-w-sm">
        Upload your first CSV file to get started with viewing and converting to PDF
      </p>
      
      <Link href="/">
        <Button className="mt-6" size="lg">
          <Upload className="mr-2 h-4 w-4" />
          Upload CSV File
        </Button>
      </Link>
    </div>
  );
}
