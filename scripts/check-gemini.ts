import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { GoogleGenAI } from '@google/genai';

// Load .env.local if present, else .env
const envLocalPath = path.resolve(process.cwd(), '.env.local');
const envPath = path.resolve(process.cwd(), '.env');

if (fs.existsSync(envLocalPath)) {
  dotenv.config({ path: envLocalPath });
  console.log('Loaded environment variables from .env.local');
} else if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
  console.log('Loaded environment variables from .env');
} else {
  dotenv.config();
}

const apiKey = process.env.GEMINI_API_KEY;
const rawModel = process.env.GEMINI_MODEL || 'gemini-3.8-flash';
const modelName = rawModel.includes('2.5') ? 'gemini-3.8-flash' : rawModel;

async function checkGemini() {
  console.log(`\n--- Gemini API Key & Model Verifier ---`);
  console.log(`Target Model : ${modelName}`);

  if (!apiKey || apiKey.trim() === '' || apiKey === 'MY_GEMINI_API_KEY' || apiKey === 'YOUR_GEMINI_API_KEY') {
    console.error(`\n❌ ERROR: GEMINI_API_KEY is missing or set to placeholder.`);
    console.error(`Please create a .env.local file with:`);
    console.error(`GEMINI_API_KEY="your-real-key-here"`);
    console.error(`GEMINI_MODEL="${modelName}"\n`);
    process.exit(1);
  }

  const maskedKey = apiKey.length > 8
    ? `${apiKey.substring(0, 4)}...${apiKey.substring(apiKey.length - 4)}`
    : '****';
  console.log(`API Key      : ${maskedKey}`);
  console.log(`Sending ping request to Gemini...\n`);

  try {
    const ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const callPromise = ai.models.generateContent({
      model: modelName,
      contents: 'Respond with the single word: OK',
      config: {
        temperature: 0.1,
      },
    });

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Request timed out after 20 seconds')), 20000)
    );

    const response: any = await Promise.race([callPromise, timeoutPromise]);
    const reply = response.text?.trim() || '';
    console.log(`Response received: "${reply}"`);

    if (reply.toUpperCase().includes('OK')) {
      console.log(`\n✅ SUCCESS: Your Gemini API key and model "${modelName}" are valid and operational!`);
      process.exit(0);
    } else {
      console.log(`\n✅ Model responded: "${reply}"`);
      process.exit(0);
    }
  } catch (err: any) {
    console.error(`\n❌ ERROR: Failed to call Gemini API.`);
    console.error(`Details: ${err?.message || err}`);
    if (err?.status) {
      console.error(`HTTP Status: ${err.status}`);
    }
    process.exit(1);
  }
}

checkGemini();
