import { Loader2 } from "lucide-react";

export default function SettingsLoading() {
  return (
    <div className="flex-1 flex items-center justify-center p-6">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}
