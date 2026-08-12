import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const dataDir = path.join(root, "research-data");
const read = (name) => JSON.parse(fs.readFileSync(path.join(dataDir, name), "utf8"));
const assert = (condition, message) => { if (!condition) throw new Error(message); };

const datasets = read("dataset-catalog.json");
const candidates = read("initiative-candidates.json");
const existingDichotomies = JSON.parse(fs.readFileSync(path.join(root, "content", "dichotomies.json"), "utf8"));
const dichotomySlugs = new Set(existingDichotomies.map((item) => item.slug));

assert(datasets.length >= 8, "Expected at least eight cataloged datasets or evidence repositories.");
assert(new Set(datasets.map((item) => item.id)).size === datasets.length, "Dataset catalog IDs must be unique.");
for (const dataset of datasets) {
  for (const field of ["id", "title", "steward", "sourceUrl", "accessMethod", "collectionStatus"]) {
    assert(dataset[field], `Dataset ${dataset.id} is missing ${field}.`);
  }
  assert(Array.isArray(dataset.joinKeys) && dataset.joinKeys.length > 0, `Dataset ${dataset.id} needs join keys.`);
}

assert(candidates.length >= 6, "Expected at least six initiative candidates.");
assert(new Set(candidates.map((item) => item.slug)).size === candidates.length, "Candidate initiative slugs must be unique.");
for (const candidate of candidates) {
  for (const field of ["slug", "name", "admissionStatus", "evaluationDesign", "evidenceStrength", "keyCaveat"]) {
    assert(candidate[field], `Candidate ${candidate.slug} is missing ${field}.`);
  }
  assert(candidate.primarySource?.url, `Candidate ${candidate.slug} needs a primary source URL.`);
  assert(candidate.relatedDichotomySlugs.every((slug) => dichotomySlugs.has(slug)), `${candidate.slug} references a missing dichotomy.`);
}

console.log(`Validated ${datasets.length} datasets and ${candidates.length} initiative candidates.`);
