// export async function generateRitual(mood: string) {
//   // Replace with real AI call later
//   const templates: Record<string, any> = {
//     Tired: {
//       title: "Sunrise Recharge",
//       script: [
//         "Close your eyes.",
//         "Inhale as the circle grows.",
//         "Exhale as it shrinks."
//       ],
//       colors: ["#2e1065", "#facc15"],
//       duration: 25,
//     },
//     Stressed: {
//       title: "Grounding Breath",
//       script: [
//         "Follow the dot with your eyes.",
//         "Let tension melt away."
//       ],
//       colors: ["#0ea5e9", "#22d3ee"],
//       duration: 30,
//     },
//   };
//   return templates[mood] || templates.Tired;
// }

export async function generateRitual(mood: string) {
  const res = await fetch("/api/generate-ritual", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mood }),
  });
  return await res.json();
}

export function normalizeRitual(data: any) {
  const defaultRitual = {
    title: "Gentle Breath",
    script: ["Breathe in", "Hold", "Breathe out", "Pause"],
    colors: ["#6366f1", "#a855f7"],
    duration: 20,
  };

  if (!data || typeof data !== "object") return defaultRitual;

  return {
    title: data.title || defaultRitual.title,
    script: Array.isArray(data.script) && data.script.length > 0
      ? data.script
      : defaultRitual.script,
    colors: Array.isArray(data.colors) && data.colors.length === 2
      ? data.colors
      : defaultRitual.colors,
    duration: typeof data.duration === "number"
      ? data.duration
      : defaultRitual.duration,
  };
}
