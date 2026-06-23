import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const contentDir = path.join(root, "content");
const schemaDir = path.join(root, "geobrowser-schema");

const readJson = (name) => JSON.parse(fs.readFileSync(path.join(contentDir, name), "utf8"));

const dichotomies = readJson("dichotomies.json");
const initiatives = readJson("initiatives.json");
const sources = readJson("sources.json");
const methods = readJson("methods.json");
const landingCards = readJson("landing-cards.json");

const evidenceStrengths = [
  ["strong-causal", "Strong causal", "Multiple strong causal designs or unusually clear outcome evidence."],
  ["promising-causal-quasi", "Promising causal/quasi", "Credible causal or quasi-causal evidence with narrower scope or replication limits."],
  ["mixed-conditional", "Mixed/conditional", "Effects vary by outcome, implementation, setting, or student group."],
  ["limited-descriptive", "Limited/descriptive", "Trend, implementation, or descriptive evidence without strong causal identification."],
  ["not-outcome-intervention", "Not an outcome intervention", "A framework or infrastructure item rather than a direct student intervention."]
];

function slugify(value) {
  return String(value)
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function csvEscape(value) {
  if (value === undefined || value === null) return "";
  const text = Array.isArray(value) ? value.join("; ") : String(value);
  if (/[",\r\n]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
  return text;
}

function writeCsv(name, headers, rows) {
  const lines = [headers.join(",")];
  for (const row of rows) {
    lines.push(headers.map((header) => csvEscape(row[header])).join(","));
  }
  fs.writeFileSync(path.join(schemaDir, name), `${lines.join("\n")}\n`, "utf8");
}

const entityRows = [];
const valueRows = [];
const relationRows = [];
const entityKeys = new Set();
const relationKeys = new Set();

function addEntity(row) {
  if (entityKeys.has(row.local_entity_key)) return;
  entityKeys.add(row.local_entity_key);
  entityRows.push({
    geo_entity_id: "",
    ...row
  });
}

function addValue(localEntityKey, propertyKey, valueType, value, sourceFile, jsonPointer = "") {
  if (value === undefined || value === null || value === "") return;
  valueRows.push({
    local_entity_key: localEntityKey,
    geo_entity_id: "",
    property_key: propertyKey,
    geo_property_id: "",
    value_type: valueType,
    value,
    source_file: sourceFile,
    json_pointer: jsonPointer
  });
}

function addRelation(row) {
  if (relationKeys.has(row.local_relation_key)) return;
  relationKeys.add(row.local_relation_key);
  relationRows.push({
    geo_relation_id: "",
    position: "",
    verified: "true",
    ...row
  });
}

function addNameDescriptionEntity(typeKey, key, name, description, sourceFile) {
  const localKey = `${typeKey}:${key}`;
  addEntity({
    local_entity_key: localKey,
    type_key: typeKey,
    name_or_title: name,
    slug: key,
    description,
    source_file: sourceFile,
    json_pointer: ""
  });
  addValue(localKey, "local_key", "TEXT", localKey, sourceFile);
  addValue(localKey, "name", "TEXT", name, sourceFile);
  addValue(localKey, "description", "TEXT", description, sourceFile);
  return localKey;
}

function addDossierRelation(toEntityKey, relationKey = "HAS_DOSSIER_ITEM") {
  addRelation({
    local_relation_key: `dossier:item:${toEntityKey}`,
    relation_key: relationKey,
    from_entity_key: "dossier:education-evidence-dossier",
    to_entity_key: toEntityKey,
    source_file: "content/*.json",
    json_pointer: ""
  });
}

addEntity({
  local_entity_key: "dossier:education-evidence-dossier",
  type_key: "dossier",
  name_or_title: "Education Evidence Dossier",
  slug: "education-evidence-dossier",
  description: "Evidence graph for U.S. education reform dichotomies, initiatives, methods, sources, and synthesis claims.",
  source_file: "README.md",
  json_pointer: ""
});
addValue("dossier:education-evidence-dossier", "local_key", "TEXT", "dossier:education-evidence-dossier", "README.md");
addValue("dossier:education-evidence-dossier", "name", "TEXT", "Education Evidence Dossier", "README.md");
addValue(
  "dossier:education-evidence-dossier",
  "description",
  "TEXT",
  "Evidence graph for U.S. education reform dichotomies, initiatives, methods, sources, and synthesis claims.",
  "README.md"
);

for (const [key, name, description] of evidenceStrengths) {
  const localKey = addNameDescriptionEntity("evidence_strength", key, name, description, "src/lib/evidence-normalization.ts");
  addDossierRelation(localKey);
}

const topicKeys = new Map();
for (const topic of [...new Set(dichotomies.map((d) => d.topic).filter(Boolean))]) {
  const key = slugify(topic);
  const localKey = addNameDescriptionEntity("topic", key, topic, `Dossier topic: ${topic}.`, "content/dichotomies.json");
  topicKeys.set(topic, localKey);
  addDossierRelation(localKey);
}

const designKeys = new Map();
for (const design of [...new Set(sources.map((s) => s.method).concat(initiatives.flatMap((i) => i.methodTags)).filter(Boolean))]) {
  const key = slugify(design);
  const localKey = addNameDescriptionEntity("research_design", key, design, `Research design tag: ${design}.`, "content/*.json");
  designKeys.set(design, localKey);
  addDossierRelation(localKey);
}

for (const method of methods) {
  const sectionKey = slugify(method.section);
  const itemKey = slugify(method.item);
  const typeKey = method.section === "Outcome" ? "outcome" : method.section === "Input variable" ? "input_variable" : "method";
  const localKey = `${typeKey}:${sectionKey}:${itemKey}`;
  addEntity({
    local_entity_key: localKey,
    type_key: typeKey,
    name_or_title: method.item,
    slug: `${sectionKey}-${itemKey}`,
    description: method.definition,
    source_file: "content/methods.json",
    json_pointer: `$[?section=='${method.section}' && item=='${method.item}']`
  });
  addValue(localKey, "local_key", "TEXT", localKey, "content/methods.json");
  addValue(localKey, "name", "TEXT", method.item, "content/methods.json");
  addValue(localKey, "description", "TEXT", method.definition, "content/methods.json");
  addValue(localKey, "method_section", "TEXT", method.section, "content/methods.json");
  addValue(localKey, "reference_urls", "TEXT", method.urls, "content/methods.json");
  addValue(localKey, "source_file", "TEXT", "content/methods.json", "content/methods.json");
  addDossierRelation(localKey);
}

for (const source of sources) {
  const localKey = `source:${source.id}`;
  addEntity({
    local_entity_key: localKey,
    type_key: "source",
    name_or_title: source.title,
    slug: source.id,
    description: source.finding,
    source_file: "content/sources.json",
    json_pointer: `$[?id=='${source.id}']`
  });
  addValue(localKey, "local_key", "TEXT", localKey, "content/sources.json");
  addValue(localKey, "title", "TEXT", source.title, "content/sources.json");
  addValue(localKey, "authors", "TEXT", source.authors, "content/sources.json");
  addValue(localKey, "year", "TEXT", source.year, "content/sources.json");
  addValue(localKey, "url", "TEXT", source.url, "content/sources.json");
  addValue(localKey, "finding", "TEXT", source.finding, "content/sources.json");
  addValue(localKey, "caveat", "TEXT", source.caveat, "content/sources.json");
  addValue(localKey, "research_design_key", "TEXT", source.method, "content/sources.json");
  addValue(localKey, "evidence_strength_key", "TEXT", source.evidenceStrength, "content/sources.json");
  addValue(localKey, "outcome_tags", "TEXT", source.outcomeTags, "content/sources.json");
  addDossierRelation(localKey);
  addRelation({
    local_relation_key: `${localKey}:design:${slugify(source.method)}`,
    relation_key: "USES_RESEARCH_DESIGN",
    from_entity_key: localKey,
    to_entity_key: designKeys.get(source.method),
    source_file: "content/sources.json",
    json_pointer: `$[?id=='${source.id}'].method`
  });
  addRelation({
    local_relation_key: `${localKey}:strength:${source.evidenceStrength}`,
    relation_key: "HAS_EVIDENCE_STRENGTH",
    from_entity_key: localKey,
    to_entity_key: `evidence_strength:${source.evidenceStrength}`,
    source_file: "content/sources.json",
    json_pointer: `$[?id=='${source.id}'].evidenceStrength`
  });
}

for (const initiative of initiatives) {
  const localKey = `initiative:${initiative.slug}`;
  addEntity({
    local_entity_key: localKey,
    type_key: "initiative",
    name_or_title: initiative.name,
    slug: initiative.slug,
    description: initiative.oneLineFinding,
    source_file: "content/initiatives.json",
    json_pointer: `$[?slug=='${initiative.slug}']`
  });
  addValue(localKey, "local_key", "TEXT", localKey, "content/initiatives.json");
  addValue(localKey, "name", "TEXT", initiative.name, "content/initiatives.json");
  addValue(localKey, "slug", "TEXT", initiative.slug, "content/initiatives.json");
  addValue(localKey, "years_scale", "TEXT", initiative.years, "content/initiatives.json");
  addValue(localKey, "category", "TEXT", initiative.category, "content/initiatives.json");
  addValue(localKey, "theory_of_action", "TEXT", initiative.theoryOfAction, "content/initiatives.json");
  addValue(localKey, "inputs_changed", "TEXT", initiative.inputVariablesChanged, "content/initiatives.json");
  addValue(localKey, "target_population", "TEXT", initiative.targetPopulation, "content/initiatives.json");
  addValue(localKey, "evaluation_designs", "TEXT", initiative.evaluationDesigns, "content/initiatives.json");
  addValue(localKey, "outputs_measured", "TEXT", initiative.outputsMeasured, "content/initiatives.json");
  addValue(localKey, "normalization_issues", "TEXT", initiative.normalizationIssues, "content/initiatives.json");
  addValue(localKey, "finding", "TEXT", initiative.oneLineFinding, "content/initiatives.json");
  addValue(localKey, "evidence_strength_key", "TEXT", initiative.evidenceStrength, "content/initiatives.json");
  addValue(localKey, "tags", "TEXT", initiative.tags, "content/initiatives.json");
  addDossierRelation(localKey);
  addRelation({
    local_relation_key: `${localKey}:strength:${initiative.evidenceStrength}`,
    relation_key: "HAS_EVIDENCE_STRENGTH",
    from_entity_key: localKey,
    to_entity_key: `evidence_strength:${initiative.evidenceStrength}`,
    source_file: "content/initiatives.json",
    json_pointer: `$[?slug=='${initiative.slug}'].evidenceStrength`
  });
  for (const methodTag of initiative.methodTags) {
    addRelation({
      local_relation_key: `${localKey}:design:${slugify(methodTag)}`,
      relation_key: "USES_RESEARCH_DESIGN",
      from_entity_key: localKey,
      to_entity_key: designKeys.get(methodTag),
      source_file: "content/initiatives.json",
      json_pointer: `$[?slug=='${initiative.slug}'].methodTags`
    });
  }
  for (const sourceId of initiative.sourceIds) {
    addRelation({
      local_relation_key: `${localKey}:source:${sourceId}`,
      relation_key: "CITES_SOURCE",
      from_entity_key: localKey,
      to_entity_key: `source:${sourceId}`,
      source_file: "content/initiatives.json",
      json_pointer: `$[?slug=='${initiative.slug}'].sourceIds`
    });
  }
}

for (const dichotomy of dichotomies) {
  const localKey = `dichotomy:${dichotomy.slug}`;
  const continuumKey = `continuum:${dichotomy.slug}`;
  addEntity({
    local_entity_key: localKey,
    type_key: "dichotomy",
    name_or_title: dichotomy.title,
    slug: dichotomy.slug,
    description: dichotomy.dek,
    source_file: "content/dichotomies.json",
    json_pointer: `$[?slug=='${dichotomy.slug}']`
  });
  addValue(localKey, "local_key", "TEXT", localKey, "content/dichotomies.json");
  addValue(localKey, "title", "TEXT", dichotomy.title, "content/dichotomies.json");
  addValue(localKey, "slug", "TEXT", dichotomy.slug, "content/dichotomies.json");
  addValue(localKey, "dek", "TEXT", dichotomy.dek, "content/dichotomies.json");
  addValue(localKey, "description", "TEXT", dichotomy.philosophicalDisagreement, "content/dichotomies.json");
  addValue(localKey, "philosophical_disagreement", "TEXT", dichotomy.philosophicalDisagreement, "content/dichotomies.json");
  addValue(localKey, "explanation", "TEXT", dichotomy.whatEvidenceSuggests, "content/dichotomies.json");
  addValue(localKey, "what_evidence_suggests", "TEXT", dichotomy.whatEvidenceSuggests, "content/dichotomies.json");
  addValue(localKey, "better_question", "TEXT", dichotomy.betterQuestion, "content/dichotomies.json");
  addValue(localKey, "common_misreadings", "TEXT", dichotomy.commonMisreadings, "content/dichotomies.json");
  addValue(localKey, "what_would_change_our_mind", "TEXT", dichotomy.whatWouldChangeOurMind, "content/dichotomies.json");
  addValue(localKey, "landing_priority", "INT64", dichotomy.landingPriority, "content/dichotomies.json");
  addValue(localKey, "evidence_strength_key", "TEXT", dichotomy.evidenceStrength, "content/dichotomies.json");
  addDossierRelation(localKey);

  addEntity({
    local_entity_key: continuumKey,
    type_key: "continuum_position",
    name_or_title: `${dichotomy.title} continuum`,
    slug: dichotomy.slug,
    description: dichotomy.continuum.explanation,
    source_file: "content/dichotomies.json",
    json_pointer: `$[?slug=='${dichotomy.slug}'].continuum`
  });
  addValue(continuumKey, "local_key", "TEXT", continuumKey, "content/dichotomies.json");
  addValue(continuumKey, "title", "TEXT", `${dichotomy.title} continuum`, "content/dichotomies.json");
  addValue(continuumKey, "left_pole", "TEXT", dichotomy.continuum.leftPole, "content/dichotomies.json");
  addValue(continuumKey, "right_pole", "TEXT", dichotomy.continuum.rightPole, "content/dichotomies.json");
  addValue(continuumKey, "position", "FLOAT64", dichotomy.continuum.position, "content/dichotomies.json");
  addValue(continuumKey, "uncertainty_low", "FLOAT64", dichotomy.continuum.uncertaintyLow, "content/dichotomies.json");
  addValue(continuumKey, "uncertainty_high", "FLOAT64", dichotomy.continuum.uncertaintyHigh, "content/dichotomies.json");
  addValue(continuumKey, "confidence", "TEXT", dichotomy.continuum.confidence, "content/dichotomies.json");
  addValue(continuumKey, "explanation", "TEXT", dichotomy.continuum.explanation, "content/dichotomies.json");
  addDossierRelation(continuumKey);

  addRelation({
    local_relation_key: `${localKey}:topic:${slugify(dichotomy.topic)}`,
    relation_key: "HAS_TOPIC",
    from_entity_key: localKey,
    to_entity_key: topicKeys.get(dichotomy.topic),
    source_file: "content/dichotomies.json",
    json_pointer: `$[?slug=='${dichotomy.slug}'].topic`
  });
  addRelation({
    local_relation_key: `${localKey}:continuum`,
    relation_key: "HAS_CONTINUUM_POSITION",
    from_entity_key: localKey,
    to_entity_key: continuumKey,
    source_file: "content/dichotomies.json",
    json_pointer: `$[?slug=='${dichotomy.slug}'].continuum`
  });
  addRelation({
    local_relation_key: `${localKey}:strength:${dichotomy.evidenceStrength}`,
    relation_key: "HAS_EVIDENCE_STRENGTH",
    from_entity_key: localKey,
    to_entity_key: `evidence_strength:${dichotomy.evidenceStrength}`,
    source_file: "content/dichotomies.json",
    json_pointer: `$[?slug=='${dichotomy.slug}'].evidenceStrength`
  });
  for (const sourceId of dichotomy.sourceIds) {
    addRelation({
      local_relation_key: `${localKey}:source:${sourceId}`,
      relation_key: "CITES_SOURCE",
      from_entity_key: localKey,
      to_entity_key: `source:${sourceId}`,
      source_file: "content/dichotomies.json",
      json_pointer: `$[?slug=='${dichotomy.slug}'].sourceIds`
    });
  }
  for (const initiativeSlug of dichotomy.keyInitiativeSlugs) {
    addRelation({
      local_relation_key: `${localKey}:initiative:${initiativeSlug}`,
      relation_key: "KEY_INITIATIVE",
      from_entity_key: localKey,
      to_entity_key: `initiative:${initiativeSlug}`,
      source_file: "content/dichotomies.json",
      json_pointer: `$[?slug=='${dichotomy.slug}'].keyInitiativeSlugs`
    });
  }
}

for (const initiative of initiatives) {
  const localKey = `initiative:${initiative.slug}`;
  for (const dichotomySlug of initiative.relatedDichotomySlugs) {
    addRelation({
      local_relation_key: `${localKey}:dichotomy:${dichotomySlug}`,
      relation_key: "RELATED_DICHOTOMY",
      from_entity_key: localKey,
      to_entity_key: `dichotomy:${dichotomySlug}`,
      source_file: "content/initiatives.json",
      json_pointer: `$[?slug=='${initiative.slug}'].relatedDichotomySlugs`
    });
  }
}

for (const card of landingCards) {
  const claimSlug = slugify(card.claim).slice(0, 80);
  const localKey = `claim:${card.dichotomySlug}:${claimSlug}`;
  addEntity({
    local_entity_key: localKey,
    type_key: "evidence_claim",
    name_or_title: claimSlug,
    slug: claimSlug,
    description: card.claim,
    source_file: "content/landing-cards.json",
    json_pointer: `$[?dichotomySlug=='${card.dichotomySlug}']`
  });
  addValue(localKey, "local_key", "TEXT", localKey, "content/landing-cards.json");
  addValue(localKey, "claim_text", "TEXT", card.claim, "content/landing-cards.json");
  addValue(localKey, "caveat", "TEXT", card.caveat, "content/landing-cards.json");
  addValue(localKey, "evidence_strength_key", "TEXT", card.evidenceStrength, "content/landing-cards.json");
  addDossierRelation(localKey);
  addRelation({
    local_relation_key: `${localKey}:dichotomy:${card.dichotomySlug}`,
    relation_key: "RELATED_DICHOTOMY",
    from_entity_key: localKey,
    to_entity_key: `dichotomy:${card.dichotomySlug}`,
    source_file: "content/landing-cards.json",
    json_pointer: `$[?dichotomySlug=='${card.dichotomySlug}'].dichotomySlug`
  });
  addRelation({
    local_relation_key: `${localKey}:strength:${card.evidenceStrength}`,
    relation_key: "HAS_EVIDENCE_STRENGTH",
    from_entity_key: localKey,
    to_entity_key: `evidence_strength:${card.evidenceStrength}`,
    source_file: "content/landing-cards.json",
    json_pointer: `$[?dichotomySlug=='${card.dichotomySlug}'].evidenceStrength`
  });
  for (const sourceId of card.sourceIds) {
    addRelation({
      local_relation_key: `${localKey}:source:${sourceId}`,
      relation_key: "CITES_SOURCE",
      from_entity_key: localKey,
      to_entity_key: `source:${sourceId}`,
      source_file: "content/landing-cards.json",
      json_pointer: `$[?dichotomySlug=='${card.dichotomySlug}'].sourceIds`
    });
  }
}

entityRows.sort((a, b) => a.local_entity_key.localeCompare(b.local_entity_key));
valueRows.sort((a, b) => `${a.local_entity_key}:${a.property_key}`.localeCompare(`${b.local_entity_key}:${b.property_key}`));
relationRows.sort((a, b) => a.local_relation_key.localeCompare(b.local_relation_key));

writeCsv("entities.csv", ["local_entity_key", "geo_entity_id", "type_key", "name_or_title", "slug", "description", "source_file", "json_pointer"], entityRows);
writeCsv("values.csv", ["local_entity_key", "geo_entity_id", "property_key", "geo_property_id", "value_type", "value", "source_file", "json_pointer"], valueRows);
writeCsv("relations.csv", ["local_relation_key", "geo_relation_id", "relation_key", "from_entity_key", "to_entity_key", "position", "verified", "source_file", "json_pointer"], relationRows);

console.log(`Generated ${entityRows.length} entities, ${valueRows.length} values, ${relationRows.length} relations.`);
