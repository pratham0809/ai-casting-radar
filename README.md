````markdown
# 🎭 AI-Powered Entertainment Job Scraper

This project scrapes various entertainment-related job listings from public job boards and freelancing platforms, parses the content using LLMs (like Mistral or OpenAI), and stores the structured data in a PostgreSQL database.

## 📌 Features

- ✨ Extracts **casting**, **actor**, **voiceover**, **film crew**, and **production assistant** jobs
- 🤖 Uses LLMs (Mistral/OpenAI) to parse raw HTML and return structured job data
- 🧠 Bypasses login and CAPTCHA by scraping only public landing pages
- 📦 Stores scraped jobs in PostgreSQL (deduplicated)
- 🔍 Handles multiple platforms and search terms
- ✅ Modular codebase with clean separation of concerns

---

## 🛠️ Tech Stack

- [TypeScript](https://www.typescriptlang.org/)
- [Playwright](https://playwright.dev/) – for headless scraping
- [OpenAI / Mistral](https://platform.openai.com/) – for structured extraction from raw HTML
- [Prisma ORM](https://www.prisma.io/)
- [PostgreSQL](https://www.postgresql.org/)
- [pnpm](https://pnpm.io/) for dependency management

---

## 🧱 Project Structure

```bash
.
├── prisma/
│   ├── schema.prisma      # DB schema
├── scrapers/
│   ├── index.ts           # Entry point
│   ├── jobBoards.ts       # Job boards & search terms config
│   ├── genericScraper.ts  # Main scraping logic
│   └── utils/
│       ├── playwright.ts  # Browser setup
│       ├── openai.ts      # OpenAI/Mistral client
│       └── extractJsonArrayFromText.ts
├── jobs/                  # (Optional) Raw JSON backup
├── .env                   # Environment variables
├── README.md
````

---

## ⚙️ Setup

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Create `.env`

```env
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/aggregation?schema=public"
OPENAI_API_KEY="sk-..." # or your Mistral endpoint
```

### 3. Setup PostgreSQL

Make sure PostgreSQL is running and the `aggregation` database exists:

```bash
createdb aggregation
```

Then run:

```bash
pnpm prisma migrate dev --name init
```

---

## 🚀 Run Scraper

```bash
pnpm tsx scrapers/index.ts
```

This will:

* Loop through all boards × search terms
* Scrape HTML using Playwright
* Ask LLM to extract **only entertainment jobs**
* Store deduplicated jobs in your DB

---

## 🧠 Prompt Logic

The prompt is carefully crafted to only extract **entertainment industry** jobs. It ensures:

* Relevance (Actor, Voiceover, Casting, etc.)
* Clean structured JSON
* No markdown or explanation

---

## 📥 Example Extracted Job

```json
{
  "title": "Casting Assistant",
  "description": "Assist in organizing auditions for a new Netflix series...",
  "location": "Los Angeles, CA",
  "company": "Netflix",
  "date": "2025-07-07",
  "applyLink": "https://www.netflix.com/jobs/apply/1234"
}
```

---

## 📌 To Do

* [ ] Add cron-based automation
* [ ] Add pagination support
* [ ] Add dashboard to view jobs
* [ ] Deploy on serverless (optional)
