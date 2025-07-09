import { chromium, Page, BrowserContext } from "playwright";

export async function withBrowser(
  fn: (page: Page, context: BrowserContext) => Promise<any>
) {
  const browser = await chromium.launch({
    headless: true, // set to false for debugging or to better mimic real users
    args: [
      "--no-sandbox",
      "--disable-blink-features=AutomationControlled", // anti-bot detection
    ],
  });

  const context = await browser.newContext({
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
    viewport: { width: 1280, height: 800 },
    javaScriptEnabled: true,
    locale: "en-US",
  });

  const page = await context.newPage();

  // 🕵️ Hide webdriver property to avoid detection
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "webdriver", {
      get: () => false,
    });
  });

  try {
    return await fn(page, context);
  } finally {
    await browser.close();
  }
}
