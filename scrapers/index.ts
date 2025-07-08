// File: scrapers/index.ts

import { scrapeGenericJobBoardWithAI } from "./genericScraper";
import fs from "fs";
import path from "path";

const jobBoards = [
  // {
  //   name: "Indeed",
  //   baseUrl: "https://in.indeed.com/jobs",
  //   paramKey: "q", // use ?q=search_term
  // },
  {
    name: "ZipRecruiter",
    baseUrl: "https://www.ziprecruiter.in/jobs/search",
    paramKey: "q", // use ?q=search_term
  },
  // {
  //   name: "Fiverr",
  //   baseUrl: "https://www.fiverr.com/search/gigs",
  //   paramKey: "query", // use ?query=search_term
  // },
  // Add more as needed
];

const entertainmentSearchTerms = [
  // "casting+director",
  "actor",
  // "actress",
  // "voiceover",
  // "video+editor",
  // "film-crew",
  // "production+assistant",
  // "cinematographer",
  // "background+artist",
];

function generateSearchUrls() {
  const urls: { platform: string; searchTerm: string; url: string }[] = [];

  for (const board of jobBoards) {
    for (const term of entertainmentSearchTerms) {
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

(async () => {
  for (const site of generateSearchUrls()) {
    console.log(`Scraping: ${site.platform}`);
    console.log(`Search URL: ${site.url}`);
    const jobs = await scrapeGenericJobBoardWithAI(site.url);

    const outDir = path.resolve(__dirname, "../jobs");
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);

    fs.writeFileSync(
      path.join(outDir, `${site.platform.toLowerCase()}.json`),
      JSON.stringify(jobs, null, 2)
    );

    console.log(`${jobs.length} jobs saved for ${site.platform}`);
  }
})();
