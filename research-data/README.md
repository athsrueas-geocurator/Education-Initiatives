# Research Data Intake

This directory is the evidence intake layer for future initiative additions. It separates:

- **cataloged datasets**: reproducible external outcome, context, and evidence sources;
- **snapshots**: small, versioned collection samples that verify access and field shape;
- **initiative candidates**: evidence-backed additions that are not yet published in `content/initiatives.json`;
- **comparison claims**: the row-level structure required before an initiative can be compared on outcomes, cost, and implementation.

Large national extracts are intentionally excluded from Git. They must be fetched from their primary source, documented with a vintage and codebook, then transformed into a bounded analysis table outside the static website build.

## Files

- `dataset-catalog.json`: source-of-truth catalog for external datasets and evidence repositories.
- `initiative-candidates.json`: review queue for missing initiatives, including a primary evidence link and admission status.
- `comparison-claims.template.csv`: required fields for a comparable study-outcome claim.
- `snapshots/urban-ccd-dc-2022.json`: a small, reproducible CCD directory sample used to verify public API access and NCES join fields.

## Collection

Run the bounded CCD sample collector:

```bash
npm run research:collect-metadata
```

The collector supports an alternate public school-directory slice without modifying the catalog:

```bash
node scripts/collect-research-metadata.mjs --year=2022 --fips=11
```

Use `NCES_ID` / `ncessch` for schools and `LEAID` / `leaid` for districts. Never infer a causal effect by joining outcome trends to an initiative name; comparison claims must retain their study design, comparator, population, and study-period metadata.

## Admission Rule

An initiative moves into `content/initiatives.json` only after it has:

1. a stable primary source or peer-reviewed study link;
2. a normalized research design and finding, including null or negative findings;
3. an explicit population, setting, outcomes, and comparison condition; and
4. at least one related dichotomy or a documented reason it is a standalone case.
