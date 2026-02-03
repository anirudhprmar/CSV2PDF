"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CsvViewer from "~/app/_components/csv-viewer";
import { getUploadedFile } from "~/lib/csvStorage";
import { Loader2 } from "lucide-react";

interface PreviewClientProps {
  isAuthenticated: boolean;
  hasPurchased: boolean;
}

export default function PreviewClient({
  isAuthenticated,
  hasPurchased,
}: PreviewClientProps) {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadFile() {
      try {
        const uploadedFile = await getUploadedFile();

        if (!uploadedFile) {
          // No file found, redirect to home
          router.push("/");
          return;
        }

        setFile(uploadedFile);
      } catch (error) {
        console.error("Failed to load file:", error);
        router.push("/");
      } finally {
        setIsLoading(false);
      }
    }

    loadFile();
  }, [router]);

  const handleBack = () => {
    router.push("/");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-lg font-medium text-muted-foreground">
            Loading preview...
          </p>
        </div>
      </div>
    );
  }

  if (!file) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-background">
      <CsvViewer
        file={file}
        onClose={handleBack}
        isAuthenticated={isAuthenticated}
        hasPurchased={hasPurchased}
      />
    </div>
  );
}
