// scrapers/types.ts
export interface Job {
  title: string;
  description: string;
  location: string;
  unionStatus?: string;
  applyLink: string;
  source: "Backstage" | "CastingFrontier" | string;
  postedAt?: Date;
}
