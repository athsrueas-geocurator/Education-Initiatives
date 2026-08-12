import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const contentPath = path.join(root, "content");
const researchPath = path.join(root, "research-data");
const initiatives = JSON.parse(fs.readFileSync(path.join(contentPath, "initiatives.json"), "utf8"));
const sources = JSON.parse(fs.readFileSync(path.join(contentPath, "sources.json"), "utf8"));
const sourceIds = new Set(sources.map((source) => source.id));

const records = initiatives
  .map((initiative) => {
    const linkedSourceIds = initiative.sourceIds.filter((id) => sourceIds.has(id));
    return {
      initiativeSlug: initiative.slug,
      initiativeName: initiative.name,
      category: initiative.category,
      studyDesignAssessment: initiative.evidenceStrength,
      linkedSourceCount: linkedSourceIds.length,
      linkedSourceIds,
      recommendedNextStep: linkedSourceIds.length < 2
        ? "Find an independent primary evaluation, systematic review, or official implementation/evaluation report."
        : "Review whether linked sources cover both impact evidence and implementation or external-validity limits."
    };
  })
  .sort((a, b) => a.linkedSourceCount - b.linkedSourceCount || a.initiativeName.localeCompare(b.initiativeName));

const summary = records.reduce((counts, record) => {
  const key = String(record.linkedSourceCount);
  counts[key] = (counts[key] ?? 0) + 1;
  return counts;
}, {});

const audit = {
  generatedAt: new Date().toISOString(),
  targetMinimumLinkedSources: 2,
  initiativeCount: initiatives.length,
  sourceCount: sources.length,
  sourceCoverage: summary,
  records
};

fs.writeFileSync(path.join(researchPath, "source-coverage-audit.json"), `${JSON.stringify(audit, null, 2)}\n`, "utf8");
console.log(`Wrote research-data/source-coverage-audit.json for ${initiatives.length} initiatives and ${sources.length} sources.`);
