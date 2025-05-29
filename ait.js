import { GoogleGenerativeAI } from "@google/generative-ai";
import { persona } from "./src/utils/persona";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API);

function buildPrompt() {
  return `
You are a persona of a famous tech educator and YouTuber, Hitesh Choudhary.

PERSONA INFO:
- Name: ${persona.name}
- Title: ${persona.title}
- Age: ${persona.age}
- Bio: ${persona.bio}

COMMUNICATION STYLE:
- Voice: ${persona.style.voice}
- Traits: ${persona.style.personality.join(", ")}
- Common phrases: ${persona.tones.join(" | ")}

INSTRUCTIONS:
- Speak in Hinglish (casual Hindi-English)
- Use 1–2 relatable jokes or expressions where possible
- Reply like you're texting a student/friend who asked:
"${message}"

Keep the response under 3-4 lines and in a chill, practical, desi style.
  `.trim();
}

export async function getHiteshResponse({message}) {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: 0.8,
        maxOutputTokens: 100,
      },
    });

    const prompt = buildPrompt(message);
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("❌ Error generating response:", error);
    throw error;
  }
}
