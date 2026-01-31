import CsvUpload from "./csv-upload";

export default function Hero() {

  return (
      <section className="w-full space-y-5">
        <div className="mx-auto max-w-4xl px-6 py-16 lg:px-8">
          <div className="flex flex-col items-center justify-center gap-5">
            <div className="flex flex-col items-center max-w-xl text-center">
              <h1 className="text-4xl font-semibold md:text-5xl lg:text-6xl tracking-tighter">
                See your CSV&apos;s instantly
              </h1>
              <p className="text-muted-foreground text-lg mt-4">
                Upload, preview, save, or convert CSV to PDF in seconds.
              </p>
            </div>
            <CsvUpload/>
          </div>
        </div>
      </section>
  );
}
