import InteractiveMap from "@/components/InteractiveMap";

export default function Home() {
  return (
    <main className="w-screen h-screen bg-stone-900 flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold text-amber-100 py-4 shrink-0">
        Les mystères de Paris
      </h1>
      <div className="flex-1 w-full min-h-0">
        <InteractiveMap />
      </div>
    </main>
  );
}