"use client";

import { Skeleton } from "~/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="min-h-screen">
      {/* Hero Section Skeleton */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center text-center space-y-6">
          <Skeleton className="h-12 w-3/4 max-w-xl" />
          <Skeleton className="h-6 w-1/2 max-w-md" />
          <Skeleton className="h-64 w-full max-w-3xl rounded-xl" />
        </div>
      </section>

      {/* Features Section Skeleton */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-4 p-6 rounded-lg border">
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
