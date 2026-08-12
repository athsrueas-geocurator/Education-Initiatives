import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const root = process.cwd();
const researchDir = path.join(root, "research-data");
const plan = JSON.parse(fs.readFileSync(path.join(researchDir, "download-plan.json"), "utf8"));
const reportPath = path.join(researchDir, "ingestion-report.json");
const requested = new Set(
  process.argv
    .filter((argument) => argument.startsWith("--only="))
    .flatMap((argument) => argument.slice("--only=".length).split(","))
    .filter(Boolean)
);

const shouldRun = (item) => requested.size === 0 || requested.has(item.datasetId);
const sha256 = (file) => createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const relative = (file) => path.relative(root, file).replaceAll("\\", "/");
const now = () => new Date().toISOString();

function ensureDirectory(file) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
}

function download(url, outputFile) {
  ensureDirectory(outputFile);
  if (fs.existsSync(outputFile) && fs.statSync(outputFile).size > 0) {
    return { state: "already-present", bytes: fs.statSync(outputFile).size, sha256: sha256(outputFile) };
  }
  const result = spawnSync(
    "curl.exe",
    ["--fail", "--location", "--retry", "3", "--retry-delay", "2", "--silent", "--show-error", "--output", outputFile, url],
    { encoding: "utf8", timeout: 30 * 60 * 1000 }
  );
  if (result.status !== 0) {
    if (fs.existsSync(outputFile)) fs.rmSync(outputFile, { force: true });
    throw new Error(`Download failed for ${url}: ${result.stderr || result.stdout || `exit ${result.status}`}`);
  }
  return { state: "downloaded", bytes: fs.statSync(outputFile).size, sha256: sha256(outputFile) };
}

async function downloadCcd(item) {
  const fipsCodes = ["01", "02", "04", "05", "06", "08", "09", "10", "11", "12", "13", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "40", "41", "42", "44", "45", "46", "47", "48", "49", "50", "51", "53", "54", "55", "56"];
  const outputDirectory = path.join(root, item.outputDirectory);
  fs.mkdirSync(outputDirectory, { recursive: true });
  const files = [];
  for (const fips of fipsCodes) {
    const outputFile = path.join(outputDirectory, `ccd-school-directory-${item.year}-fips-${fips}.json`);
    const url = `https://educationdata.urban.org/api/v1/schools/ccd/directory/${item.year}/?fips=${fips}`;
    const result = download(url, outputFile);
    const payload = JSON.parse(fs.readFileSync(outputFile, "utf8"));
    if (!Array.isArray(payload.results)) throw new Error(`Unexpected CCD payload for FIPS ${fips}.`);
    files.push({ fips, url, path: relative(outputFile), recordCount: payload.count, ...result });
  }
  const totalRecords = files.reduce((total, file) => total + file.recordCount, 0);
  return { state: "downloaded", totalRecords, artifacts: files };
}

const report = {
  generatedAt: now(),
  requested: requested.size ? [...requested] : "all-ready-artifacts",
  results: []
};

for (const item of plan.filter(shouldRun)) {
  const base = { datasetId: item.datasetId, planStatus: item.status, startedAt: now() };
  try {
    if (item.status !== "ready") {
      report.results.push({ ...base, state: item.status, accessUrl: item.accessUrl, notes: item.notes, completedAt: now() });
      continue;
    }
    if (item.mode === "urban-ccd-state-api") {
      report.results.push({ ...base, ...(await downloadCcd(item)), completedAt: now() });
      continue;
    }
    const artifacts = item.mode === "files" ? item.artifacts : [{ url: item.url, outputFile: item.outputFile }];
    const downloads = artifacts.map((artifact) => {
      const file = path.join(root, artifact.outputFile);
      return { url: artifact.url, path: artifact.outputFile, ...download(artifact.url, file) };
    });
    report.results.push({ ...base, state: "downloaded", artifacts: downloads, completedAt: now() });
  } catch (error) {
    report.results.push({ ...base, state: "failed", error: error instanceof Error ? error.message : String(error), completedAt: now() });
  }
}

fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
const failed = report.results.filter((result) => result.state === "failed");
console.log(`Wrote ${relative(reportPath)} with ${report.results.length} dataset results.`);
if (failed.length) {
  for (const failure of failed) console.error(`${failure.datasetId}: ${failure.error}`);
  process.exitCode = 1;
}
