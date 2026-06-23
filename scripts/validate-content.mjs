import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const contentDir = path.join(root, "content");

function readJson(name) {
  const file = path.join(contentDir, name);
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

const dichotomies = readJson("dichotomies.json");
const initiatives = readJson("initiatives.json");
const sources = readJson("sources.json");
const methods = readJson("methods.json");
const glossary = readJson("glossary.json");

const sourceIds = new Set(sources.map((source) => source.id));
const initiativeSlugs = new Set(initiatives.map((initiative) => initiative.slug));
const dichotomySlugs = new Set(dichotomies.map((dichotomy) => dichotomy.slug));

assert(dichotomies.length >= 20, "Expected at least 20 dichotomies.");
assert(initiatives.length >= 50, "Expected at least 50 initiatives.");
assert(sources.length > 0, "Expected sources.");
assert(methods.length > 0, "Expected methods.");
assert(glossary.length > 0, "Expected glossary.");

for (const dichotomy of dichotomies) {
  assert(dichotomy.slug, `Dichotomy has no slug: ${dichotomy.title}`);
  assert(dichotomy.title, `Dichotomy has no title: ${dichotomy.slug}`);
  assert(!dichotomy.slug.includes(" "), `Invalid dichotomy slug: ${dichotomy.slug}`);
  assert(Array.isArray(dichotomy.sourceIds) && dichotomy.sourceIds.length > 0, `${dichotomy.slug} has no sources.`);
  assert(dichotomy.sourceIds.every((id) => sourceIds.has(id)), `${dichotomy.slug} references a missing source.`);
  const c = dichotomy.continuum;
  assert(c, `${dichotomy.slug} has no continuum.`);
  assert(c.position >= 0 && c.position <= 100, `${dichotomy.slug} has invalid continuum position.`);
  assert(c.uncertaintyLow >= 0 && c.uncertaintyLow <= c.position, `${dichotomy.slug} has invalid lower uncertainty.`);
  assert(c.uncertaintyHigh >= c.position && c.uncertaintyHigh <= 100, `${dichotomy.slug} has invalid upper uncertainty.`);
  assert(["high", "medium", "low"].includes(c.confidence), `${dichotomy.slug} has invalid confidence.`);
  assert(
    dichotomy.keyInitiativeSlugs.every((slug) => initiativeSlugs.has(slug)),
    `${dichotomy.slug} references a missing initiative.`
  );
}

for (const initiative of initiatives) {
  assert(initiative.slug, `Initiative has no slug: ${initiative.name}`);
  assert(Array.isArray(initiative.sourceIds), `${initiative.slug} sourceIds must be an array.`);
  assert(initiative.sourceIds.every((id) => sourceIds.has(id)), `${initiative.slug} references a missing source.`);
  assert(
    initiative.relatedDichotomySlugs.every((slug) => dichotomySlugs.has(slug)),
    `${initiative.slug} references a missing dichotomy.`
  );
}

console.log(
  `Validated ${dichotomies.length} dichotomies, ${initiatives.length} initiatives, ${sources.length} sources.`
);
