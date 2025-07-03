import { chromium, Browser, Page } from "playwright";

export async function withBrowser(fn: (page: Page) => Promise<any>) {
  const browser = await chromium.launch({
    headless: true, // 🧠 Keep headless but spoof a real browser
  });

  const context = await browser.newContext({
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
    viewport: { width: 1280, height: 800 },
    javaScriptEnabled: true,
  });

  const page = await context.newPage();
  try {
    return await fn(page);
  } finally {
    await browser.close();
  }
}
