"use client";
import { useRouter } from "next/navigation";
import { useRitualStore } from "@/lib/store";
import { generateRitual, normalizeRitual } from "@/lib/ai";

export default function Home() {
  const router = useRouter();
  const { setMood, setRitual } = useRitualStore();

  const moods = ["Tired", "Stressed", "Calm", "Inspired"];

  async function handleMood(mood: string) {
    setMood(mood);
    // const ritual = await import("@/lib/ai").then(m => m.generateRitual(mood));
    const ritual = normalizeRitual(await generateRitual(mood));
    setRitual(ritual);
    router.push("/ritual");
  }

  return (
    <main className="flex flex-col items-center justify-center h-screen gap-6">
      <h1 className="text-3xl font-semibold">How are you feeling?</h1>
      <div className="flex gap-4">
        {moods.map(m => (
          <button
            key={m}
            onClick={() => handleMood(m)}
            className="px-6 py-3 rounded-2xl bg-indigo-600 text-white hover:scale-105 transition"
          >
            {m}
          </button>
        ))}
      </div>
    </main>
  );
}
