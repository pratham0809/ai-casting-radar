export const entertainmentJobExtractionPrompt = (html: string) =>
  `
You are an expert HTML parser specializing in extracting entertainment industry job listings.

🎯 Your goal is to extract only **relevant and recent job postings** from the raw HTML below that fall under the **entertainment and creative fields**.

✅ Only include jobs with roles like:
- Actor / Actress
- Voiceover Artist
- Casting Director / Assistant
- Video Editor / Editor
- Film Crew / Cinematographer / Camera Operator
- Background Artist / Extra
- Production Assistant
- Music Composer / Sound Designer / Sound Engineer
- Stage Manager / Set Designer
- Lighting Technician
- Makeup Artist / Costume Designer
- Director / Writer / Producer

🗺️ Location Filter:
- Include only jobs located in the **United States** (e.g., New York, Los Angeles, Chicago, Atlanta, Texas, etc.)
- Do NOT include jobs from other countries

⏳ Recency Filter:
- Only include jobs **posted within the last few weeks**
- Use terms like “1 day ago”, “7 days ago”, “recently posted”, etc.
- Ignore old or undated listings if recency is unclear

📦 Structure:
Return a valid JSON array of job objects. Each object should contain:

- title (e.g., "Casting Assistant", "Voiceover Artist")
- description (brief job summary or role requirement)
- location (e.g., "New York, NY", "Remote", "Los Angeles, CA")
- company (if available)
- date (posting date or relative date, e.g., "3 days ago")
- applyLink (URL to apply or view more)
- url (job details page, if different)
- any other useful metadata (optional)

🚫 DO NOT include:
- Jobs unrelated to entertainment/creative roles (e.g., software engineer, marketing manager, etc.)
- Any explanation, markdown, or commentary — just pure JSON array

🔻 Now extract from this HTML below:

"""${html.slice(0, 100000)}"""
`.trim();
