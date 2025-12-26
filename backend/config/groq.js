import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.GROQ_API_KEY || process.env.GROK_API_KEY;

if (!apiKey) {
    console.error("CRITICAL ERROR: GROQ_API_KEY is missing!");
}

const groq = new Groq({
    apiKey: apiKey
});

// Using llama-3.3-70b-versatile as it's a good default for Groq
const model = "llama-3.3-70b-versatile";

export { groq, model, apiKey };
