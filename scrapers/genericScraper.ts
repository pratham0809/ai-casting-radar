import { withBrowser } from "./utils/playwright";
import openaiClient from "./utils/openai"; // assumes you configured Mistral or OpenAI here
import { extractJsonArrayFromText } from "./utils/extractJsonArrayFromText";

interface AIGeneratedJob {
  title: string;
  location?: string;
  description?: string;
  applyLink?: string;
  [key: string]: any;
}

export async function scrapeGenericJobBoardWithAI(
  url: string
): Promise<AIGeneratedJob[]> {
  return await withBrowser(async (page) => {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });

    const htmlContent = await page.evaluate(() => document.body.innerText);

    const prompt = `Extract all casting or creative job listings from the following raw HTML content.
For each job, return a JSON object with:
- title
- description
- location
- applyLink (if available)

Only return a JSON array of jobs.

HTML:
"""${htmlContent.slice(0, 100000)}"""`; // Mistral context limit: ~32k tokens

    const response = await openaiClient.chat.completions.create({
      model: "mistralai/mistral-small-3.2-24b-instruct:free", // free model for now
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

    // Cleanup if AI wraps in markdown or extra text
    const aiResponse = response.choices[0].message.content ?? "";
    const jobs = extractJsonArrayFromText(aiResponse);

    try {
      return jobs;
    } catch (err) {
      console.error("❌ Failed to parse AI response:", aiResponse);
      throw err;
    }
  });
}
