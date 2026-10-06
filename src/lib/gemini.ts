import { GoogleGenAI } from '@google/genai';

// Next.jsのAPI Route（サーバーサイド）でのみ使用することを想定しています
export const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your_api_key_here') {
    throw new Error('GEMINI_API_KEY is not set in .env.local');
  }
  return new GoogleGenAI({ apiKey });
};
