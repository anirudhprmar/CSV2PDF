"use client";

import { Skeleton } from "~/components/ui/skeleton";

export default function PreviewLoading() {
  return (
    <div className="min-h-screen p-4">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-32" />
          <div className="flex gap-2">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>

        {/* Table Skeleton */}
        <div className="border rounded-lg overflow-hidden">
          {/* Table Header */}
          <div className="flex gap-4 p-4 bg-muted/50 border-b">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-6 flex-1" />
            ))}
          </div>

          {/* Table Rows */}
          {[...Array(10)].map((_, rowIndex) => (
            <div key={rowIndex} className="flex gap-4 p-4 border-b last:border-0">
              {[...Array(5)].map((_, colIndex) => (
                <Skeleton 
                  key={colIndex} 
                  className="h-5 flex-1" 
                  style={{ opacity: 1 - rowIndex * 0.08 }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
