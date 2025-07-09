// scrapers/index.ts
import { scrapeGenericJobBoardWithAI } from "./genericScraper";
import { jobBoards, entertainmentKeywords } from "./utils/constants";
import { prisma } from "./lib/db";

function generateSearchUrls() {
  const urls: { platform: string; searchTerm: string; url: string }[] = [];

  for (const board of jobBoards) {
    for (const term of entertainmentKeywords) {
      const searchUrl = `${board.baseUrl}?${board.paramKey}=${term}`;
      urls.push({
        platform: board.name,
        searchTerm: term,
        url: searchUrl,
      });
    }
  }

  return urls;
}

function deduplicateJobs(jobs: any[]) {
  const seen = new Set();
  return jobs.filter((job) => {
    const key = `${job.title}-${job.location}-${job.applyLink}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

(async () => {
  const errorLog: {
    platform: string;
    searchTerm: string;
    url: string;
    error: string;
  }[] = [];

  for (const site of generateSearchUrls()) {
    console.log(`🔍 Scraping: ${site.platform}`);
    console.log(`🌐 URL: ${site.url}`);

    try {
      const jobs = await scrapeGenericJobBoardWithAI(site.url);
      for (const job of jobs) {
        try {
          await prisma.job.upsert({
            where: {
              title_location_applyLink: {
                title: job.title,
                location: job.location ?? "",
                applyLink: job.applyLink ?? "",
              },
            },
            update: {}, // Do nothing if already exists
            create: {
              platform: site.platform,
              searchTerm: site.searchTerm,
              title: job.title,
              description: job.description,
              location: job.location,
              company: job.company,
              date: job.date,
              url: job.url,
              applyLink: job.applyLink,
            },
          });
        } catch (jobError) {
          console.warn(`⚠️ Failed to save job:`, job.title, jobError);
        }
      }

      console.log(`✅ ${jobs.length} jobs processed for ${site.platform}`);
    } catch (error: any) {
      console.error(
        `❌ Error scraping ${site.platform}:`,
        error.message || error
      );
      errorLog.push({
        platform: site.platform,
        searchTerm: site.searchTerm,
        url: site.url,
        error: error.message || JSON.stringify(error),
      });
    }
  }

  if (errorLog.length) {
    console.log(
      `⚠️ Completed with ${errorLog.length} errors. Storing to database log soon...`
    );
    // Optionally insert into error DB/log table here
  }

  await prisma.$disconnect();
})();
