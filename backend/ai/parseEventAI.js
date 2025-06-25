// File: backend/ai/parseEventAI.js

import { OpenAI } from "openai";

console.log("🔍 OPENAI_API_KEY:", process.env.OPENAI_API_KEY);
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function parseTextToEvent(inputText) {
  const now = new Date();
  const nowISO = now.toISOString();

  const systemPrompt = `
You are a scheduling assistant for a construction company.
TODAY'S DATE is: ${nowISO}

Always schedule events in the future — never use a date earlier than today.
If the user says something like “next Monday” or “Friday,” assume they mean the next future occurrence based on TODAY.

If a start time is given but no end time, assume a 1-hour duration.
If no time is given, treat the event as all-day.

Return a valid JSON object with these fields:
- summary (string)
- location (string or null)
- start.dateTime (ISO 8601)
- end.dateTime (ISO 8601)
- description (string or null)
- crew (string or null)
- equipment (array of strings, or empty array)

Use Pacific Time in all timestamps.
`;

  const userPrompt = `Instruction: "${inputText}"

Return only a valid JSON object.`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.2,
  });

  const text = completion.choices[0].message.content.trim();

  try {
    return JSON.parse(text);
  } catch (err) {
    console.error("Failed to parse OpenAI output as JSON:", text);
    throw new Error("AI response was not valid JSON.");
  }
}
