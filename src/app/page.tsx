import Link from "next/link";

const stories = [
  { id: "tuileries", label: "Le fantôme rouge — Tuileries" },
  { id: "Louvre", label: "Louvre" },
  { id: "catacombes", label: "Catacombes" },
  { id: "opera", label: "Opéra" },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-amber-50 flex flex-col items-center justify-center gap-6 px-6">
      <h1 className="text-3xl font-bold text-stone-800">Les mystères de Paris</h1>
      <p className="text-stone-500 text-center">Choisir une histoire :</p>
      <div className="flex flex-col gap-4 w-full max-w-xs">
        {stories.map((s) => (
          <Link
            key={s.id}
            href={`/story/${s.id}`}
            className="bg-amber-400 hover:bg-amber-500 active:scale-95 text-white text-xl font-semibold py-5 px-6 rounded-2xl shadow text-center transition-transform"
          >
            {s.label}
          </Link>
        ))}
      </div>
    </main>
  );
}