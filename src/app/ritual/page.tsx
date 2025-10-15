"use client";
import { useRitualStore } from "@/lib/store";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function RitualPage() {
  const router = useRouter();
  const { ritual, addCompleted } = useRitualStore();
  const [step, setStep] = useState(0);

  if (!ritual) {
    router.push("/");
    return null;
  }

  const colors = ritual.colors ?? ["#6366f1", "#a855f7"];
  const script = ritual.script ?? ["Breathe in", "Hold", "Breathe out"];
  const duration = ritual.duration ?? 20;

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((s) => (s + 1 < script.length ? s + 1 : s));
    }, (duration * 1000) / script.length);
    return () => clearInterval(interval);
  }, [script, duration]);

  return (
    <main
      className="flex flex-col items-center justify-center h-screen text-white transition-colors"
      style={{
        background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})`,
      }}
    >
      <motion.div
        animate={{ scale: [1, 1.3, 1] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="w-40 h-40 rounded-full bg-white/20 mb-10"
      />
      <p className="text-2xl font-light text-center w-72">{script[step]}</p>
      {step === script.length - 1 && (
        <button
          onClick={() => {
            addCompleted(ritual);
            router.push("/reflect");
          }}
          className="mt-10 px-6 py-2 bg-white/30 rounded-xl"
        >
          Done
        </button>
      )}
    </main>
  );
}
