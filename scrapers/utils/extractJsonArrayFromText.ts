import stripJsonComments from "strip-json-comments";

export function extractJsonArrayFromText(raw: string): any[] {
  if (!raw || typeof raw !== "string") {
    throw new Error("AI response is empty or not a string.");
  }

  const jsonMatch = raw.match(/```json([\s\S]*?)```/) || raw.match(/(\[.*\])/s);

  if (!jsonMatch) {
    console.warn("⚠️ No JSON block detected in AI response.");
    throw new Error("No JSON found in response");
  }

  let jsonString = jsonMatch[1] || jsonMatch[0];

  // Clean up non-JSON parts
  jsonString = stripJsonComments(jsonString)
    .replace(/^[^{\[]*/, "") // remove anything before `{` or `[`
    .replace(/[^}\]]*$/, ""); // remove anything after `}` or `]`

  try {
    return JSON.parse(jsonString);
  } catch (err) {
    console.error("❌ Still failed to parse cleaned JSON:", jsonString);
    throw err;
  }
}
