import type { Source } from "./content-schema";

const methodRank: Record<string, number> = {
  RCT: 1,
  Lottery: 1,
  "Regression discontinuity": 2,
  "Difference-in-differences": 2,
  "Event study": 2,
  "Matched comparison": 3,
  "Meta-analysis": 2,
  "Systematic review": 2,
  Descriptive: 5
};

export function rankSources(sources: Source[]): Source[] {
  return [...sources].sort((a, b) => {
    const rankA = methodRank[a.method] ?? 9;
    const rankB = methodRank[b.method] ?? 9;
    if (rankA !== rankB) return rankA - rankB;
    return a.title.localeCompare(b.title);
  });
}
