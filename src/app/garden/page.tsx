"use client";
import { useRitualStore } from "@/lib/store";

export default function Garden() {
  const { completed } = useRitualStore();
  return (
    <main className="p-10 grid grid-cols-2 md:grid-cols-3 gap-6">
      {completed.map((r, i) => (
        <div
          key={i}
          className="h-40 rounded-3xl flex items-center justify-center text-white"
          style={{
            background: `linear-gradient(135deg, ${r.colors[0]}, ${r.colors[1]})`,
          }}
        >
          {r.title}
        </div>
      ))}
    </main>
  );
}
