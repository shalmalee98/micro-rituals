"use client";

import { useRouter } from "next/navigation";
import { useRitualStore } from "@/lib/store";
import { generateRitual, normalizeRitual } from "@/lib/ai";
import { motion } from "framer-motion";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
// import type { Engine } from "tsparticles";
import { useRef, useState } from "react";

export default function Home() {
  const router = useRouter();
  const { setMood, setRitual } = useRitualStore();
  const audioRef = useRef<HTMLAudioElement>(null);

  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const moods = ["Tired", "Stressed", "Calm", "Inspired"];

  async function handleMood(mood: string) {
    setLoading(true);
    setSelectedMood(mood);

    try {
      setMood(mood);
      const ritual = normalizeRitual(await generateRitual(mood));
      setRitual(ritual);

      // Play calming audio when mood selected
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {});
      }

      router.push("/ritual");
    } catch (err) {
      console.error("Failed to generate ritual:", err);
    } finally {
      setLoading(false);
    }
  }

  const particlesInit = async (engine: any) => {
    await loadFull(engine);
  };

  return (
    <main className="relative flex flex-col items-center justify-center h-screen gap-8 overflow-hidden">
      {/* Particle Background */}
      <Particles
        id="landing-particles"
        init={particlesInit}
        options={{
          fullScreen: { enable: false },
          background: { color: { value: "transparent" } },
          particles: {
            number: { value: 50 },
            color: { value: "#ffffff40" },
            shape: { type: "circle" },
            opacity: { value: 0.2 },
            size: { value: 3 },
            move: { enable: true, speed: 0.2, direction: "none", outModes: "out" },
          },
        }}
        className="absolute inset-0 -z-10"
      />

      {/* Intro Content */}
      <motion.div
        className="flex flex-col items-center gap-6 z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h1 className="text-4xl font-semibold tracking-tight text-white">
          How are you feeling?
        </h1>

        <div className="flex flex-wrap gap-4 justify-center">
          {moods.map((m) => (
            <motion.button
              key={m}
              onClick={() => handleMood(m)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className={`px-6 py-3 rounded-2xl bg-indigo-600 text-white transition shadow-lg hover:shadow-xl disabled:opacity-50`}
              disabled={loading}
            >
              {m}
            </motion.button>
          ))}
        </div>

        {loading && <p className="text-white/70 mt-4">Generating your ritual...</p>}
      </motion.div>

      {/* Ambient Audio */}
      <audio ref={audioRef} loop>
        <source src="/audio/calm-waves.mp3" type="audio/mpeg" />
      </audio>
    </main>
  );
}
