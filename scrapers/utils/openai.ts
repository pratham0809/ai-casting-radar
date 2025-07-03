// lib/openai.ts
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey:
    "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",
});

export default openai;
