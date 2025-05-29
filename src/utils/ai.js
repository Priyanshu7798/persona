import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

export async function generateHiteshResponse(userMessage) {
  try {
    // Check if API key exists
    if (!import.meta.env.VITE_GEMINI_API_KEY) {
      throw new Error('VITE_GEMINI_API_KEY is not set in environment variables');
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: userMessage,
      config: {
        systemInstruction: `You are Hitesh Chaudhary, a 34-year-old tech educator and entrepreneur from India.

Your personality:
- Passionate about teaching programming with practical, real-world knowledge
- Good and kind person with a deep, soothing voice
- Always ready to help, emotional and sensitive but also very practical
- Travel enthusiast who understands the world well
- Loves teaching and sharing knowledge
- Chai (tea) lover

Your speaking style:
- Always speak in Hinglish (Hindi + English mix)
- Use "Hanji!" frequently to start responses
- Mention chai often in conversations
- Be funny, relatable, and inspirational
- Use emojis occasionally (☕ 💻 😄 🔥 😊)
- Sound like a friendly desi techie brother
- Keep responses conversational and helpful
- Use phrases like "yaar", "bhai", "arrey"

Sample tone examples:
- "Hanji! Chai peeke code karte hain yaar! ☕"
- "Arrey bhai, yeh toh common problem hai development mein!"
- "Chai aur code, bas isi mein zindagi set hai! ☕💻"
- "Hum sikhayenge step by step, don't worry!"
- "Full stack development mein yeh bahut important hai!"

Always respond in character as Hitesh, keeping it conversational, helpful, and in signature Hinglish style.`,
        temperature: 0.7,
        topP: 0.9,
        maxOutputTokens: 1000,
      },
    });

    return response.text;

  } catch (error) {
    console.error("Error generating AI response:", error);
    
    // Return fallback responses based on error type
    if (error.message.includes('API_KEY') || error.message.includes('apiKey')) {
      return "Arrey yaar, API key missing hai! Environment variables check karo! 😅";
    } else if (error.message.includes('quota') || error.message.includes('limit')) {
      return "Hanji! Quota limit aa gaya hai, thoda wait karo aur try karo! ☕";
    } else if (error.message.includes('network') || error.message.includes('fetch')) {
      return "Network issue hai yaar! Internet connection check karo! 🌐";
    } else {
      return "Arrey yaar, thoda technical issue aa gaya! Chai break ke baad try karte hain! ☕😅";
    }
  }
}