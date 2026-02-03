
import CsvUpload from "../../_components/csv-upload";

export default function UploadPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
       <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Upload CSV</h1>
          <p className="text-muted-foreground mt-2">
            Upload your CSV file to preview and convert it to PDF.
          </p>
        </div>
        
        <CsvUpload />
      </div>
    </div>
  );
}
