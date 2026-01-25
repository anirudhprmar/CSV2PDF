"use client"
import { Button } from "~/components/ui/button";

export default function Hero() {
  return (
    <section className="w-full space-y-5">
        <div className="mx-auto max-w-4xl px-6 py-16 lg:px-8 selection:bg-primary selection:text-white">
          <div className="flex flex-col items-center justify-center gap-5">

            <div className="flex flex-col items-center max-w-xl text-center">
              <h1 className="text-4xl font-semibold md:text-5xl lg:text-6xl tracking-tighter">
                See your CSV&apos;s instantly
              </h1>
              <p className="text-muted-foreground text-lg mt-4">
                 Upload, preview, save, or convert to PDF in seconds.
              </p>
            </div>

            <div
              className="hover:border-primary/50 w-full cursor-pointer rounded-lg border-2 border-dashed p-8 transition-colors "
              onClick={() => document.getElementById("file-input")?.click()}
            >
              <input
                id="file-input"
                type="file"
                accept=".csv"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    console.log("File selected:", file.name);
                  }
                }}
              />
              <div className="flex flex-col items-center space-y-2">
                <div className="font-medium text-md">
                  Choose CSV file or drag here
                </div>
                <Button variant="outline">Browse Files</Button>
              </div>
            </div>
          </div>
        </div>
      </section>
  )
}
