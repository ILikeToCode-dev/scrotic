
// This service handles communication with the Google Gemini API.
import { GoogleGenAI, Chat, Part } from '@google/genai';

// Use a singleton pattern to ensure only one instance of the AI and chat is created.
let ai: GoogleGenAI | null = null;
let chat: Chat | null = null;

const getAI = () => {
  if (!ai) {
    if (!process.env.API_KEY) {
      throw new Error("API_KEY environment variable is not set.");
    }
    // Fix: Initialize GoogleGenAI with the required API key object
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return ai;
};

export const startChat = () => {
  const aiInstance = getAI();
  // Fix: Use ai.chats.create to start a new chat session.
  chat = aiInstance.chats.create({
    model: 'gemini-2.5-flash',
    config: {
        systemInstruction: 'You are a Socratic math tutor. When the user uploads an image of a math problem (calculus or algebra), your goal is to guide them through solving it step-by-step. Do not give the answer directly. Instead, ask leading questions to help them think and arrive at the solution themselves. Explain concepts clearly and concisely along the way. If the user asks for the answer, gently refuse and remind them that the goal is to learn by doing. Be encouraging and patient.',
    }
  });
};

export interface ImagePart {
    data: string; // base64 encoded string
    mimeType: string;
}

export async function* generateTextStream(prompt: string, image?: ImagePart) {
    if (!chat) {
      startChat();
    }
    if (chat) {
      // Fix: Ensure messageParts is an array of `Part` objects.
      const messageParts: Part[] = [];
      
      if (image) {
        // The Gemini API prefers the image part to come first.
        messageParts.push({
            inlineData: {
                data: image.data,
                mimeType: image.mimeType,
            },
        });
      }
      messageParts.push({ text: prompt });


      // Fix: Use sendMessageStream for a better user experience with streaming responses.
      const result = await chat.sendMessageStream(messageParts);
      for await (const chunk of result) {
        yield chunk.text;
      }
    } else {
        yield "Chat not initialized.";
    }
  }