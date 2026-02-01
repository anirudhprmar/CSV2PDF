"use client";

import { FileText, MoreVertical, Share2, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import Link from "next/link";
import { useState } from "react";
import DeleteDialog from "./delete-dialog";

interface FileCardProps {
  id: string;
  fileName: string;
  fileSize: number;
  lastAccessedAt: Date;
  onDelete: (id: string) => void;
}

export function FileCard({
  id,
  fileName,
  fileSize,
  lastAccessedAt,
  onDelete,
}: FileCardProps) {
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleDeleteConfirm = () => {
    onDelete(id);
    setConfirmDelete(false);
  };

  return (
    <>
      <div className="group flex items-center justify-between rounded-lg border border-border bg-card p-4 transition-all hover:border-primary/50 hover:shadow-md">
        <Link href={`/preview?fileId=${id}`} className="flex flex-1 items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900/20">
            <FileText className="h-5 w-5 text-orange-600 dark:text-orange-400" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-foreground truncate">{fileName}</h3>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span>{formatFileSize(fileSize)}</span>
              <span>•</span>
              <span>Opened {formatDistanceToNow(new Date(lastAccessedAt), { addSuffix: true })}</span>
            </div>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
            <Share2 className="h-4 w-4" />
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem 
                onClick={() => setConfirmDelete(true)} 
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <DeleteDialog
        open={confirmDelete}
        onOpenChange={setConfirmDelete}
        onConfirm={handleDeleteConfirm}
        fileName={fileName}
      />
    </>
  );
}
