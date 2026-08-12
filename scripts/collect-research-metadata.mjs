import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const snapshotDir = path.join(root, "research-data", "snapshots");

function getArgument(name, fallback) {
  const prefix = `--${name}=`;
  const value = process.argv.find((argument) => argument.startsWith(prefix));
  return value ? value.slice(prefix.length) : fallback;
}

const year = getArgument("year", "2022");
const fips = getArgument("fips", "11");

if (!/^\d{4}$/.test(year)) throw new Error("year must be a four-digit calendar year.");
if (!/^\d{1,2}$/.test(fips)) throw new Error("fips must be a one- or two-digit state FIPS code.");

const normalizedFips = fips.padStart(2, "0");
const url = `https://educationdata.urban.org/api/v1/schools/ccd/directory/${year}/?fips=${normalizedFips}`;
const response = await fetch(url, {
  headers: {
    Accept: "application/json",
    "User-Agent": "Education-Evidence-Dossier research catalog collector (public-data metadata)"
  }
});

if (!response.ok) {
  throw new Error(`CCD collection failed (${response.status}) for ${url}`);
}

const payload = await response.json();
if (!Array.isArray(payload.results)) throw new Error("Unexpected CCD response: results was not an array.");

fs.mkdirSync(snapshotDir, { recursive: true });
const collectedAt = new Date().toISOString();
const snapshot = {
  datasetId: "ccd-public-school-directory",
  provenance: {
    provider: "Urban Institute Education Data Portal",
    authoritativeSource: "National Center for Education Statistics Common Core of Data",
    url,
    collectedAt
  },
  query: { year: Number(year), fips: normalizedFips },
  recordCount: payload.count,
  fields: payload.results.length ? Object.keys(payload.results[0]) : [],
  records: payload.results
};

const filename = `urban-ccd-fips-${normalizedFips}-${year}.json`;
fs.writeFileSync(path.join(snapshotDir, filename), `${JSON.stringify(snapshot, null, 2)}\n`, "utf8");
console.log(`Collected ${payload.count} CCD school-directory records into research-data/snapshots/${filename}`);
