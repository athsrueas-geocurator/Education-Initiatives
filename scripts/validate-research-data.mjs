import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const dataDir = path.join(root, "research-data");
const read = (name) => JSON.parse(fs.readFileSync(path.join(dataDir, name), "utf8"));
const assert = (condition, message) => { if (!condition) throw new Error(message); };

const datasets = read("dataset-catalog.json");
const candidates = read("initiative-candidates.json");
const downloadPlan = read("download-plan.json");
const initiativeDatasetLinks = read("initiative-dataset-links.json");
const ingestionReport = read("ingestion-report.json");
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

assert(downloadPlan.length >= datasets.length, "The download plan must account for every cataloged source.");
const planIds = new Set(downloadPlan.map((item) => item.datasetId));
for (const dataset of datasets) {
  assert(planIds.has(dataset.id), `Dataset ${dataset.id} is missing from the download plan.`);
}

const reportByDataset = new Map(ingestionReport.results.map((result) => [result.datasetId, result]));
for (const item of downloadPlan) {
  const result = reportByDataset.get(item.datasetId);
  assert(result, `Download report is missing ${item.datasetId}.`);
  if (item.status === "ready") {
    assert(result.state === "downloaded", `${item.datasetId} should be downloaded, but report state is ${result.state}.`);
    assert(Array.isArray(result.artifacts) && result.artifacts.length > 0, `${item.datasetId} has no downloaded artifacts.`);
  }
}

if (process.argv.includes("--verify-raw")) {
  for (const result of ingestionReport.results.filter((item) => item.state === "downloaded")) {
    for (const artifact of result.artifacts ?? []) {
      assert(artifact.path, `${result.datasetId} has an artifact without a path.`);
      const artifactPath = path.join(root, artifact.path);
      assert(fs.existsSync(artifactPath), `Missing local raw artifact: ${artifact.path}`);
      assert(fs.statSync(artifactPath).size === artifact.bytes, `Size mismatch for local raw artifact: ${artifact.path}`);
    }
  }
}

for (const link of initiativeDatasetLinks) {
  assert(link.initiativeSlug && link.datasetId && link.role && link.use, "Each initiative-dataset link needs an initiative, dataset, role, and use.");
  assert(planIds.has(link.datasetId), `${link.initiativeSlug} links an unknown dataset.`);
}

console.log(`Validated ${datasets.length} datasets, ${candidates.length} initiative candidates, ${downloadPlan.length} download-plan entries, ${initiativeDatasetLinks.length} initiative-dataset links, and ${ingestionReport.results.length} ingestion results.`);
