"use client";
import Link from "next/link";
import { Button } from "~/components/ui/button";

export default function Page() {

    return (
    <div className="min-h-full w-full">
      <header className="w-full">
        <nav className="flex items-center justify-around p-5">
          <div className="font-bold text-xl">CSV Viewer & Converter</div>
          <div className="flex items-center justify-center gap-2 text-md">
            <ul className="flex items-center justify-center gap-2 text-muted-foreground">
              <li className="hover:text-foreground cursor-pointer transition-colors">Demo</li>
              <li className="hover:text-foreground cursor-pointer transition-colors">Blogs</li>
              <li className="hover:text-foreground cursor-pointer transition-colors">Pricing</li>
            </ul>
            <Link href={"/login"}>
              <Button variant={"default"} size={"lg"} className="text-lg">Login</Button>
            </Link>
          </div>
        </nav>
      </header>
      <section className="w-full">
        <div className="mx-auto max-w-6xl px-6 py-16 lg:px-8">
          <div className="flex flex-col items-center justify-center gap-5">

            <div className="flex flex-col items-center">
              <h1 className="text-4xl font-semibold md:text-5xl lg:text-6xl">
                View & Convert CSV files
              </h1>
              <p className="text-muted-foreground text-lg">
                simply upload, view it, save it for later or download in PDF
                format in seconds.
              </p>
            </div>

            <div
              className="hover:border-primary/50 w-full cursor-pointer rounded-lg border-2 border-dashed p-8 transition-colors"
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
                <div className="font-medium">
                  Choose CSV file or drag here
                </div>
                <Button variant="outline">Browse Files</Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div></div>
      </section>
    </div>
  );
}
