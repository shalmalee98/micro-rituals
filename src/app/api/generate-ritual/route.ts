import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { mood } = await req.json();

  const prompt = `
    You are a mindfulness ritual designer for a web app.

    Task: Given the mood "${mood}", output a JSON object describing a short micro-ritual.

    **Important rules:**
    - Return **only valid JSON**, no explanations, no text outside JSON.
    - JSON MUST have all keys: 
    {
        "title": string,       // poetic short title
        "script": string[3-5], // array of short steps
        "colors": [string, string], // exactly 2 hex colors
        "duration": number     // seconds between 15 and 45
    }
    - "colors" must always have exactly 2 valid hex codes (for background gradient)
    - "script" must always be an array of 3–5 strings
    - Respond exactly with JSON

    Example valid JSON:
    {
    "title": "Sunrise Recharge",
    "script": ["Close eyes", "Breathe in slowly", "Exhale tension", "Focus on warmth"],
    "colors": ["#3b82f6", "#f472b6"],
    "duration": 30
    }
    `;

    console.log('env open ai key - ', process.env.OPENAI_API_KEY)

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-5-codex",
      messages: [
        { role: "system", content: "You create JSON rituals for UI experiences." },
        { role: "user", content: prompt },
      ],
      temperature: 0.9,
    }),
  });

  if (!res.ok) {
      const errText = await res.text();
      console.error("OpenAI API returned an error:", res.status, errText);
      return NextResponse.json({ error: "OpenAI API error", details: errText }, { status: 500 });
    }

  const data = await res.json();

  console.log("GPT response:", data);

    // Defensive check: does choices exist?
    if (!data.choices || !data.choices[0]?.message?.content) {
      console.error("Missing content in GPT response:", data);
      return NextResponse.json({ error: "Missing content in GPT response" }, { status: 500 });
    }
  try {
    const text = data.choices[0].message.content;
    const json = JSON.parse(text);
    return NextResponse.json(json);
  } catch (err) {
    console.error("Failed to parse AI output", err);
    return NextResponse.json({ error: "Bad AI response" }, { status: 500 });
  }
}
