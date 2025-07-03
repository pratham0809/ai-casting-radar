// scrapers/backstage.ts
import { withBrowser } from "./utils/playwright";
import { extractMetadataUsingAI } from "./utils/extractMetadataUsingAI";

export const scrapeBackstageJobs = async (): Promise<[]> => {
  return await withBrowser(async (page) => {
    await page.goto(
      "https://www.backstage.com/casting/lifestyle-photo-video-shoot-in-coronado-ca-2976975/?role_id=5294397",
      {
        waitUntil: "domcontentloaded",
      }
    );

    // Step 1: Wait for role groups to appear
    await page.waitForSelector(".role-group__button-container");

    // Step 2: Click all toggler buttons
    const togglers = await page.$$(".role-group__button-container");

    for (const toggler of togglers) {
      try {
        await toggler.click();
        await page.waitForTimeout(300); // Wait a bit for content to expand
      } catch (err) {
        console.warn("Failed to click toggler:", err);
      }
    }

    // Step 3: Grab all expanded role content
    const roles = await page.$$eval(".role-group", (groups) =>
      groups.map((group) => {
        return group.textContent?.trim() ?? "";
      })
    );

    // Step 4: Send each role's full content to AI
    for (const fullDescription of roles) {
      const metadata = await extractMetadataUsingAI(fullDescription);

      console.log({ metadata });
    }

    return [];
  });
};
