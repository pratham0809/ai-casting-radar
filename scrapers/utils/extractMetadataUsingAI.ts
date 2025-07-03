import openaiCLient from "./openai";

export async function extractMetadataUsingAI(description: string) {
  const userPrompt = `Extract casting job metadata from the following description.

Return only a JSON object like:
{
"roleName": "e.g., Lead Actor, Supporting Actress, Extra, etc.",
  "roleType": "Lead | Supporting | Extra | Unknown",
  "gender": "Male | Female | Any",
  "ageRange": "e.g., 18-25 or Unknown",
  "Ethnicity": "e.g., Caucasian, Hispanic, African American, Asian, Middle Eastern, All Ethnicities etc. or Unknown",
  "unionStatus": "SAG-AFTRA | Non-Union | Unknown",
  "payRate": "e.g., $500/day",
  "applyLink": "e.g., https://www.backstage.com/casting/role-name-1234567/",
}

Description:
"""${description}"""`;

  const response = await openaiCLient.chat.completions.create({
    model: "mistralai/mistral-small-3.2-24b-instruct:free",
    messages: [
      {
        role: "system",
        content:
          "You are a helpful assistant that extracts structured casting metadata from job descriptions.",
      },
      {
        role: "user",
        content: userPrompt,
      },
    ],
    temperature: 0.9,
  });

  const raw = response.choices?.[0]?.message?.content;

  if (!raw) throw new Error("AI response was empty");

  try {
    // 🧼 Clean up markdown code block syntax if present
    const cleaned = raw
      .replace(/^```json/i, "") // remove starting ```json
      .replace(/^```/, "") // in case it's just ```
      .replace(/```$/, "") // remove ending ```
      .trim();

    return JSON.parse(cleaned);
  } catch (err) {
    console.error("Failed to parse AI response:", raw);
    throw err;
  }
}
