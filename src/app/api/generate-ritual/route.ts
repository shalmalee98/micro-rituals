import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { mood } = await req.json();

  const prompt = `
  You are a mindfulness ritual designer for a web app.

  Task: Given the mood "${mood}", output a JSON object describing a short micro-ritual.

  Important rules:
  - Return only valid JSON, no explanations.
  - JSON must have these keys: 
    {
      "title": string,
      "script": string[3-5],
      "colors": [string, string],
      "duration": number
    }
  - Respond with valid JSON only.
  `;

    console.log("GROQ_API_KEY present:", process.env.GROQ_API_KEY);

  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-20b",
        messages: [
          { role: "system", content: "You create JSON rituals for UI experiences." },
          { role: "user", content: prompt },
        ],
        temperature: 1,
        max_completion_tokens: 512,
        top_p: 1,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Groq API error:", res.status, errText);
      return NextResponse.json({ error: "Groq API error", details: errText }, { status: 500 });
    }

    const data = await res.json();
    const text = data.choices?.[0]?.message?.content?.trim();
    if (!text) throw new Error("No content in Groq response");

    const jsonStr = text.match(/\{[\s\S]*\}/)?.[0];
    if (!jsonStr) throw new Error("No JSON found in AI output");

    const json = JSON.parse(jsonStr);
    return NextResponse.json(json);
  } catch (err: any) {
    console.error("Failed to fetch from Groq:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
