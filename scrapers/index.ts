// scrapers/index.ts
import { scrapeBackstageJobs } from "./backstage";

export const runAllScrapers = async () => {
  const allJobs = [...(await scrapeBackstageJobs())];

  console.log(`Scraped ${allJobs.length} jobs`);
  return allJobs;
};

if (require.main === module) {
  runAllScrapers();
}
