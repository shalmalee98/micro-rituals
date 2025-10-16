"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

type Ritual = {
  title: string;
  script: string[];
  colors: [string, string];
  duration: number; // seconds per step
};

export default function RitualPage() {
  const [ritual, setRitual] = useState<Ritual | null>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [mood, setMood] = useState("");

  const audioRef = useRef<HTMLAudioElement>(null);
  const stepTimerRef = useRef<NodeJS.Timeout | null>(null);

  const fetchRitual = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/generate-ritual", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mood }),
      });
      const data = await res.json();
      if (res.ok) {
        setRitual(data);
        setStepIndex(0);

        // Play audio after user interaction
        setTimeout(() => {
          audioRef.current?.play().catch(() => {
            console.warn("User interaction needed to play audio");
          });
        }, 100);
      } else {
        console.error("API error:", data);
      }
    } catch (err) {
      console.error("Failed to fetch ritual:", err);
    } finally {
      setLoading(false);
    }
  };

  // Auto-advance steps
  useEffect(() => {
    if (!ritual) return;
    if (stepIndex >= ritual.script.length) return;

    stepTimerRef.current = setTimeout(() => {
      setStepIndex((i) => i + 1);
    }, ritual.duration * 1000);

    return () => {
      if (stepTimerRef.current) clearTimeout(stepTimerRef.current);
    };
  }, [ritual, stepIndex]);

  const goNextStep = () => {
    if (!ritual) return;
    setStepIndex((i) => Math.min(i + 1, ritual.script.length - 1));
  };

  const goPrevStep = () => {
    if (!ritual) return;
    setStepIndex((i) => Math.max(i - 1, 0));
  };

  const gradient =
    ritual?.colors && ritual.colors.length === 2
      ? `linear-gradient(135deg, ${ritual.colors[0]}, ${ritual.colors[1]})`
      : "linear-gradient(135deg, #1e3a8a, #9333ea)";

  const particlesInit = async (engine: any) => {
    await loadFull(engine);
  };

  return (
    <div
      className="relative flex flex-col items-center justify-center min-h-screen text-white overflow-hidden transition-all duration-700"
      style={{ background: gradient }}
    >
      {/* Particle Background */}
      <Particles
        id="ritual-particles"
        init={particlesInit}
        options={{
          fullScreen: { enable: false },
          background: { color: { value: "transparent" } },
          particles: {
            number: { value: 40 },
            color: { value: "#ffffff40" },
            shape: { type: "circle" },
            opacity: { value: 0.2 },
            size: { value: 3 },
            move: { enable: true, speed: 0.3, direction: "none", outModes: "out" },
          },
        }}
        className="absolute inset-0 -z-10"
      />

      {/* Intro */}
      {!ritual && (
        <motion.div
          className="flex flex-col items-center gap-6 z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <h1 className="text-4xl font-light tracking-tight">🪷 Micro Rituals</h1>
          <p className="text-base text-white/70 text-center max-w-sm">
            Describe your current mood and receive a calming, AI-crafted ritual.
          </p>

          <input
            type="text"
            placeholder="Enter your mood..."
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            className="px-4 py-2 rounded-full text-black focus:outline-none focus:ring-2 focus:ring-white/50 w-64 text-center"
          />
          <button
            disabled={!mood || loading}
            onClick={fetchRitual}
            className="px-6 py-2 rounded-full bg-white/20 hover:bg-white/30 transition disabled:opacity-50"
          >
            {loading ? "Generating..." : "Create Ritual"}
          </button>
        </motion.div>
      )}

      {/* Ritual screen */}
      {ritual && (
        <AnimatePresence mode="wait">
          <motion.div
            key={stepIndex}
            className="flex flex-col items-center justify-center gap-6 p-6 text-center z-10"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            <h2 className="text-3xl font-semibold">{ritual.title}</h2>

            {/* Breathing circle */}
            <motion.div
              className="w-32 h-32 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{
                duration: ritual.duration,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <motion.span className="text-xl">
                {ritual.script[stepIndex]}
              </motion.span>
            </motion.div>

            <p className="text-white/70 text-sm mt-4">
              Step {stepIndex + 1} of {ritual.script.length}
            </p>

            {/* Manual step controls */}
            <div className="flex gap-4 mt-4">
              <button
                onClick={goPrevStep}
                className="px-4 py-2 rounded-full bg-white/20 hover:bg-white/30 transition disabled:opacity-50"
                disabled={stepIndex === 0}
              >
                ◀ Previous
              </button>
              <button
                onClick={goNextStep}
                className="px-4 py-2 rounded-full bg-white/20 hover:bg-white/30 transition disabled:opacity-50"
                disabled={stepIndex === ritual.script.length - 1}
              >
                Next ▶
              </button>
            </div>

            {stepIndex >= ritual.script.length - 1 && (
              <motion.button
                onClick={() => setRitual(null)}
                className="mt-6 px-5 py-2 rounded-full bg-white/30 hover:bg-white/40 transition"
              >
                Restart ✨
              </motion.button>
            )}
          </motion.div>
        </AnimatePresence>
      )}

      {/* Audio layer */}
      <audio ref={audioRef} loop>
        <source src="/audio/calm-waves.mp3" type="audio/mpeg" />
      </audio>
    </div>
  );
}
