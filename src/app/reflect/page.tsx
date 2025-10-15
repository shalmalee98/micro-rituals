"use client";
import { useRouter } from "next/navigation";
import { useRitualStore } from "@/lib/store";

export default function Reflect() {
  const router = useRouter();
  const { completed } = useRitualStore();
  const latest = completed[completed.length - 1];

  return (
    <main className="flex flex-col items-center justify-center h-screen gap-6">
      <h2 className="text-2xl">How do you feel after "{latest?.title}"?</h2>
      <div className="flex gap-4 text-3xl">
        {["😞", "😐", "🙂", "😊", "🤩"].map(e => (
          <button key={e} onClick={() => router.push("/garden")}>{e}</button>
        ))}
      </div>
    </main>
  );
}
