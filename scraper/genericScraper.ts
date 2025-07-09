import { withBrowser } from "./utils/playwright";
import openaiClient from "./utils/openai";
import { extractJsonArrayFromText } from "./utils/extractJsonArrayFromText";
import { entertainmentJobExtractionPrompt } from "./prompts/jobExtractionPrompt";

export interface AIGeneratedJob {
  title: string;
  location?: string;
  description?: string;
  company?: string;
  date?: string;
  url?: string;
  applyLink?: string;
  [key: string]: any;
}

export async function scrapeGenericJobBoardWithAI(
  url: string
): Promise<AIGeneratedJob[]> {
  return await withBrowser(async (page) => {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 90000 });

    const htmlContent = await page.evaluate(() => document.body.innerHTML);

    const prompt = entertainmentJobExtractionPrompt(htmlContent);

    const response = await openaiClient.chat.completions.create({
      model: "gpt-4o", // or "gpt-3.5-turbo" if you're on the free tier
      messages: [
        {
          role: "system",
          content:
            "You are a web scraping assistant that extracts structured data from HTML pages.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const aiResponse = response.choices[0].message.content ?? "";

    try {
      return extractJsonArrayFromText(aiResponse);
    } catch (err) {
      console.error("❌ Failed to parse AI response:\n", aiResponse);
      throw err;
    }
  });
}
