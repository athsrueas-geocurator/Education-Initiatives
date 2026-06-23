# Content-to-Graph Mapping

## Entity Keys

Use deterministic local keys until Geo UUIDs are assigned:

- `dossier:education-evidence-dossier`
- `dichotomy:{slug}`
- `continuum:{dichotomy_slug}`
- `initiative:{slug}`
- `source:{id}`
- `method:{section}:{item}`
- `topic:{topic}`
- `evidence_strength:{evidenceStrength}`
- `research_design:{method}`
- `claim:{dichotomySlug}:{claim_slug}`

## Dichotomies

Each row in `content/dichotomies.json` becomes:

- One `dichotomy` entity.
- One `continuum_position` entity.
- One `topic` entity, deduplicated by topic name.
- Relations:
  - `HAS_TOPIC` from dichotomy to topic.
  - `HAS_CONTINUUM_POSITION` from dichotomy to continuum.
  - `HAS_EVIDENCE_STRENGTH` from dichotomy to evidence strength.
  - `CITES_SOURCE` from dichotomy to every source in `sourceIds`.
  - `KEY_INITIATIVE` from dichotomy to every initiative in `keyInitiativeSlugs`.

The continuum values should stay on the `continuum_position` entity because they represent an editorial synthesis, not intrinsic properties of either pole.

## Initiatives

Each row in `content/initiatives.json` becomes one `initiative` entity.

Relations:

- `RELATED_DICHOTOMY` to each slug in `relatedDichotomySlugs`.
- `CITES_SOURCE` to each source in `sourceIds`.
- `HAS_EVIDENCE_STRENGTH` to the normalized strength node.
- `USES_RESEARCH_DESIGN` to method nodes derived from `methodTags`.

The `inputVariablesChanged` and `outputsMeasured` fields can stay as text first. If the graph needs finer querying later, split those strings into `input_variable` and `outcome` entities.

## Sources

Each row in `content/sources.json` becomes one `source` entity.

Relations:

- `USES_RESEARCH_DESIGN` to a `research_design` node from `method`.
- `HAS_EVIDENCE_STRENGTH` to an `evidence_strength` node.

Keep `url` as a text property so source cards can link directly to the original evidence.

## Methods

Each row in `content/methods.json` becomes one `method` entity.

Use `section` as a property rather than a type. Sections such as `Evidence signal`, `Input variable`, and `Outcome` are editorial groupings that may change.

## Evidence Claims

Each row in `content/landing-cards.json` becomes one `evidence_claim` entity.

Relations:

- `RELATED_DICHOTOMY` to `dichotomySlug`.
- `CITES_SOURCE` to every `sourceId`.
- `HAS_EVIDENCE_STRENGTH` to the claim strength.

Claims are intentionally separate from sources because one source can support several claims and one claim can synthesize several sources.
