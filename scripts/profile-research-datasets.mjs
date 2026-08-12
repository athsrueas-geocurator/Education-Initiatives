import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const root = process.cwd();
const rawRoot = path.join(root, "research-data", "raw");
const output = path.join(root, "research-data", "dataset-profiles.json");
const listZip = (file) => {
  const result = spawnSync("tar.exe", ["-tf", file], { encoding: "utf8" });
  if (result.status !== 0) throw new Error(`Could not read ${file}: ${result.stderr}`);
  return result.stdout.split(/\r?\n/).filter(Boolean);
};
const readZipHeader = (file, entry) => {
  const result = spawnSync("tar.exe", ["-xOf", file, entry], { encoding: "utf8", maxBuffer: 2 * 1024 * 1024 });
  if (result.status !== 0) return [];
  return (result.stdout.split(/\r?\n/, 1)[0] ?? "").split(",").map((value) => value.trim());
};
const bytes = (file) => fs.statSync(file).size;
const relative = (file) => path.relative(root, file).replaceAll("\\", "/");

const ccdDirectory = path.join(rawRoot, "ccd-public-school-directory", "2022");
const ccdFiles = fs.readdirSync(ccdDirectory).filter((file) => file.endsWith(".json"));
const ccd = ccdFiles.map((file) => JSON.parse(fs.readFileSync(path.join(ccdDirectory, file), "utf8")));
const crdcFile = path.join(rawRoot, "crdc", "2021-22-crdc-data.zip");
const scorecardFile = path.join(rawRoot, "college-scorecard", "Most-Recent-Cohorts-Institution_06102026.zip");
const edfactsFile = path.join(rawRoot, "edfacts", "SY2223-Chronic-Absenteeism-EDE-110724.zip");
const ipedsDirectory = path.join(rawRoot, "ipeds-2024");

const profile = {
  generatedAt: new Date().toISOString(),
  profiles: [
    {
      datasetId: "ccd-public-school-directory",
      purpose: "School and district directory context; join schools by NCES IDs.",
      artifacts: ccdFiles.length,
      recordCount: ccd.reduce((sum, item) => sum + item.count, 0),
      columns: Object.keys(ccd[0].results[0]).sort(),
      joinKeys: ["ncessch", "leaid", "fips"],
      path: relative(ccdDirectory)
    },
    {
      datasetId: "seda-v5",
      purpose: "School achievement benchmarking, not program exposure measurement.",
      path: "research-data/raw/seda-v6/seda_school_pool_cs_6.0.csv",
      bytes: bytes(path.join(rawRoot, "seda-v6", "seda_school_pool_cs_6.0.csv")),
      joinKeys: ["ncessch", "leaid", "state"],
      columns: fs.readFileSync(path.join(rawRoot, "seda-v6", "seda_school_pool_cs_6.0.csv"), "utf8").split(/\r?\n/, 1)[0].split(",")
    },
    {
      datasetId: "census-f33-school-finance",
      purpose: "District-level revenue, expenditure, and debt context from the Census Annual Survey of School System Finances.",
      path: "research-data/raw/census-f33/elsec24.xlsx",
      bytes: bytes(path.join(rawRoot, "census-f33", "elsec24.xlsx")),
      joinKeys: ["LEAID", "state", "district name"],
      format: "XLSX workbook; use its data dictionary and table labels when creating a bounded analysis extract."
    },
    ...fs.readdirSync(path.join(rawRoot, "naep-2022")).filter((file) => file.endsWith(".xlsx")).map((file) => ({
      datasetId: "naep-data-explorer",
      purpose: "Public national, state, and participating urban-district mathematics benchmark tables for grades 4 and 8.",
      path: relative(path.join(rawRoot, "naep-2022", file)),
      bytes: bytes(path.join(rawRoot, "naep-2022", file)),
      joinKeys: ["jurisdiction", "assessment year", "grade", "subject", "student group"],
      format: "XLSX workbook; preserve NAEP significance flags, accommodation status, and reporting notes."
    })),
    ...[
      ["edfacts-ed-data-express", edfactsFile, "Chronic-absence outcome context by SEA, LEA, and school.", ["LEAID", "NCESSCH", "ST_LEAID"]],
      ["crdc", crdcFile, "Civil-rights access and discipline context by LEA and school.", ["LEAID", "NCESSCH"]],
      ["college-scorecard", scorecardFile, "Postsecondary completion, debt, repayment, and earnings context by institution.", ["UNITID", "OPEID"]]
    ].map(([datasetId, file, purpose, joinKeys]) => {
      const entries = listZip(file);
      const csvEntries = entries.filter((entry) => entry.toLowerCase().endsWith(".csv"));
      return { datasetId, purpose, path: relative(file), bytes: bytes(file), archiveEntries: entries, csvSchemas: csvEntries.slice(0, 50).map((entry) => ({ entry, columns: readZipHeader(file, entry) })), joinKeys };
    }),
    ...fs.readdirSync(ipedsDirectory).filter((file) => file.endsWith(".zip")).map((file) => {
      const archive = path.join(ipedsDirectory, file);
      const entry = listZip(archive).find((name) => name.toLowerCase().endsWith(".csv"));
      return { datasetId: "ipeds", purpose: "Postsecondary directory, characteristics, completions, and dual-enrollment context.", path: relative(archive), bytes: bytes(archive), csvSchemas: entry ? [{ entry, columns: readZipHeader(archive, entry) }] : [], joinKeys: ["UNITID"] };
    }),
    {
      datasetId: "what-works-clearinghouse",
      purpose: "Versioned local capture of every WWC record cited in this dossier, indexed by source and supported initiative.",
      artifacts: fs.readdirSync(path.join(rawRoot, "wwc-dossier-corpus")).filter((file) => file.endsWith(".html")).map((file) => ({ path: relative(path.join(rawRoot, "wwc-dossier-corpus", file)), bytes: bytes(path.join(rawRoot, "wwc-dossier-corpus", file)) })),
      indexPath: "research-data/wwc-dossier-index.json",
      joinKeys: ["source ID", "intervention name", "study citation", "WWC review identifier"]
    }
  ]
};

fs.writeFileSync(output, `${JSON.stringify(profile, null, 2)}\n`, "utf8");
console.log(`Wrote ${relative(output)} with ${profile.profiles.length} profiles.`);
