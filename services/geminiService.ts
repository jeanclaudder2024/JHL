import { GoogleGenAI } from "@google/genai";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API Key is missing");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const generateConciergeResponse = async (
  userMessage: string,
  history: { role: string; text: string }[]
): Promise<string> => {
  const ai = getClient();
  if (!ai) return "I apologize, but I cannot connect to the concierge service at the moment.";

  try {
    const model = 'gemini-3-flash-preview';
    const systemInstruction = `You are the "JHL Concierge", an AI assistant for "Just Human Life", a premium lifestyle platform.
    
    About JHL:
    - We offer B2B meal subscriptions, corporate memberships, and high-end event catering.
    - Our philosophy is elegant, human-centric, and healthy.
    - Design aesthetic: Minimalist, Monochrome, Premium.
    
    Your Tone:
    - Sophisticated, polite, concise, and helpful.
    - Do not use emojis. Use professional language.
    
    Services you can discuss:
    1. Individual Plans: Daily meal delivery for professionals.
    2. Company Memberships: Subsidized meal plans for teams.
    3. Events: Bespoke catering for corporate or private gatherings.
    
    If asked about pricing, mention that "Pricing is tailored to specific needs, please refer to our subscription page or contact sales."
    `;

    // Convert history to format expected by API if needed, but for simple generateContent we can just append context
    // Ideally use chat.sendMessage for history, but for this stateless implementation:
    
    const chat = ai.chats.create({
      model: model,
      config: {
        systemInstruction: systemInstruction,
      },
      history: history.map(h => ({
        role: h.role,
        parts: [{ text: h.text }]
      }))
    });

    const result = await chat.sendMessage({ message: userMessage });
    return result.text || "I apologize, I could not generate a response.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "I am currently experiencing high traffic. Please try again later.";
  }
};
