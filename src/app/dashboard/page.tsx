import { FileList } from "./_components/FileList";

export default function Dashboard() {

  return (
    <div className="container mx-auto px-4 py-4 max-w-7xl space-y-8">
      <section className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">Your Files</h2>
        <FileList />
      </section>
    </div>
  );
}
